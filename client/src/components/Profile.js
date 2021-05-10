import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import './Profile.css'
import { Button } from '@material-ui/core';
import {useStateValue} from '../contexts/StateProvider'
import { auth, DataBase } from './firebase';


const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar:{
        width: theme.spacing(15),
        height: theme.spacing(15),
        marginTop:10,
        marginLeft:10,
        marginBottom:10,
        marginRight:10,
      },
}));

function Profile() {
    //get the user from the provider
    const [{user}, dispatch] = useStateValue();
    const classes = useStyles();
    //store the user fields from the database 
    const [userInfo,setUserInfo] = useState([])
    //store the number of posts inside posts collection
    const [numberOfPosts, setNumberOfPosts] = useState(0)
//===========================================================================================

  useEffect(() => {
      //load the user info from Database on load or when user changes
      const unsubscribe = DataBase.collection('users').doc(user.uid).onSnapshot(snapshot=>{
                                  setUserInfo(snapshot.data());
                                  console.log(userInfo)
      })

                        //   DataBase.collection('users').doc(user.uid).collection('posts').onSnapshot(snapshot=>{
                        //           setNumberOfPosts(snapshot.size)
                        //   })
      return () => {
          unsubscribe()
      }
  }, [user])
//==================================================Log out =======================================
const logout = () => {
    //remove the user from the local storage
    // localStorage.setItem('user','null')
    auth.signOut().then(() => {
      console.log("sucessfully singned out")
    }).catch((error) => {
      alert(error.message)
    });
    }
//============================================================================================

    return (
        <div className="profile">
                <Card className="profile__card" elevation={1}>
                    <div className="profile__header">
                        <div className="profile__headerTop">
                                <Avatar className={classes.avatar} alt={'username'} src="/static/images/avatar/1.jpg" ></Avatar>
                                <div className="profle__headerInfo">
                                    <Typography>{user.displayName}</Typography>
                                    <Typography>{`Joined on " + ${'Joining date'}`}</Typography>
                                </div>
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        </div>
                                              {/*Edit button*/}
                        <center className="profile__headerEditButton"><Button >Edit Profile</Button></center>
                        <div className="profile__headerTypography">
                            <Typography>{userInfo?.bio}</Typography>
                            <Typography>Interests</Typography>
                        </div>

                                            {/*log out button*/}
                        <Button className="profile__logoutButton" onClick={logout}>Log out</Button>
                    </div>
                    <div className="profile__footer">
                    <CardContent>
                        <Typography variant="h5">
                            STATS
                        </Typography>
                        <div className="profile__footerStats">
                            <div className="profile__footerStatsPosts">
                                 
                                <Typography variant="body2" >
                                    Posts
                                </Typography>
                                <p>{numberOfPosts}</p>
                                  
                               
                            </div>
                            <div className="profile__footerStatsEvents">
                                <Typography variant="body2" >
                                    EVENTS
                                </Typography>
                                <p>{'#events'}</p>
                            </div>
                            <div className="profile__footerStatsFriends">
                                <Typography variant="body2" >
                                    FRIENDS
                                </Typography>
                                <p>{'#friends'}</p>
                            </div>
                        </div>
                    </CardContent>
                    </div>
                    </Card>
        </div>
    )
}

export default Profile
