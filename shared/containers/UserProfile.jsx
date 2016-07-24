import React from 'react';
import {connect} from 'react-redux';
import Skill from '../components/skill';
import uuid from 'node-uuid';
import update from 'react-addons-update';

class UserProfile extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      user: null
    }
  }

  componentDidMount(){
    if(socket){
      socket.emit('user:profile',{username:this.props.params.username},function(err,data){
        if(err){
          console.log('error: ',err)
        }else{
          console.log('recieved data on user Profile :  ',data)
          this.setState({user:data})
        }
      }.bind(this))
    }
  }

  handleClick(id,idx){
    console.log('button for skill : ',id,' clicked!!! @ ',idx)
    if(socket){
      socket.emit('user:vote',{account_skill_id:id,voter_level:this.props.level,votee:this.state.user.username},function(err,data){
        if(err){
          console.log(err)
        }else{
          this.setState({user:update(this.state.user,{
            skills:{
              [idx]:{
                commends:{
                  $apply:function(i){
                    console.log('i value is : ',i)
                    return i + 1;
                  }
                }
              }
            }
          })})
        }
      }.bind(this))
    }
  }

  render(){
    // console.log('profile belong to user ? : ',this.state.user.username )
    console.log('this.state.user.username: ',this.state,' props: ',this.props)
    return(
      <div>
        <h1> User Profile of {this.props.params.username} </h1>

        {
          this.state.user ?
          <div>
            <h2> {this.state.user.xp} - xp </h2>
            <h2> {this.state.user.level} - level </h2>
            {
              this.state.user.skills.map((skill,idx) => {
                return (
                  <div key={uuid.v4()}>
                    <Skill skill={skill.skill} commends={skill.commends} />

                    {/* probably a better way to do the below? checks if the profile belongs to the logged in user or not */}

                    {
                      this.state.user.username == this.props.username ?
                      null : <button onClick={this.handleClick.bind(this,skill.id,idx)}>Commend</button>
                    }

                  </div>
                )
              })
            }
          </div>
          :
          <h2> loading .... </h2>
        }

      </div>
    )
  }
}


const mapStateToProps = (state) => {
  console.log('state.User: ',state.User)
  const {username,level} = state.User;
  return {
    username,level
  }
}

const UserProfileContainer = connect(mapStateToProps)(UserProfile)

export default UserProfileContainer;
