import './App.css';
import { useState, useEffect } from "react";
import axios from 'axios';


function App() {
  const [click, setClick] = useState(false);
  const [read, setRead] = useState(false);
  const [write, setWrite] = useState(false);
  const [readwrite, setReadWrite] = useState(false);
  const [active, setActive] = useState(false);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState(null);

  // Users list
  const [users, setUsers] = useState([]);

  // Storing the particular user's details
  const [user, setuser] = useState(-1);
  const [userread, setuserRead] = useState(false);
  const [userwrite, setuserWrite] = useState(false);
  const [userreadwrite, setuserReadWrite] = useState(false);
  const [useractive, setuserActive] = useState(false);
  const [username, setusername] = useState("");
  const [useremail, setuseremail] = useState("");
  const [userpassword, setuserpassword] = useState(null);

  // Fetch users from the backend API
  useEffect(() => {
    axios
      .get(`http://localhost:5000/getusers`) // Fetch users from the API
      .then((response) => {
        // Check if the users array length is greater than 0
        if (response.data.users.length > 0) {
          setUsers(response.data.users); // Set users state with response data
        } else {
          console.log('No users found');
          setUsers([]); // Optionally set users to an empty array if no users are found
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  },[users]); 
  // Set the user details when a user is selected
  useEffect(() => {
    if (user !== -1) {
      const selectedUser = users[user];
      setuserRead(selectedUser.read);
      setuserWrite(selectedUser.write);
      setuserReadWrite(selectedUser.readwrite);
      setuserActive(selectedUser.active);
      setusername(selectedUser.name);
      setuseremail(selectedUser.email);
      setuserpassword(selectedUser.password);
    }
  }, [user, users]);

     // send object details to backend
  function sent() {
    console.log("Sent the data");
    const newuser = {
      "name": name,
      "email": email,
      "password": password,
      "read": read,
      "write": write,
      "readwrite": readwrite,
      "activate": active
    };
    
  axios.post(`http://localhost:5000/createuser`,newuser)
    .then((res)=>{
      if(res.data.error){
        console.log(res.data.errormessage);
        setClick(false);
      }else{
        console.log(res.data.user.active);
        alert("new user created");
        setClick(false);
      }
    })
    .catch((error)=>{
        console.log(error);
        setClick(false);
    })
   
  }

  // Close the form
  function close() {
    setuser(-1);
    setClick(false);
  }

  // Update existing user
  function updateuser() {
    // Ensure a user is selected
    if (user >= 0) {
        console.log("Updating user data");

        // Create the updated user object from state
        const updatedUserDetails = {
            name: username,           // Updated username
            email: email,         //non Updated email
            password: userpassword,   // Updated password
            read: userread,           // Updated read permission
            write: userwrite,         // Updated write permission
            readwrite: userreadwrite, // Updated readwrite permission
            active: useractive        // Updated active status
        };

        // Send the updated data to the backend (replace the URL with your actual endpoint)
        axios.post(`/updateuser/${users[user].id}`, updatedUserDetails)
        .then((response) => {
          if(response.data.message){console.log("unable to update the user due to unfilled fields")}
          else{
          console.log('User updated successfully:', response.data.user);
          alert('User updated successfully');
          
          // Update the local users state to reflect the changes
          const updatedUsers = [...users]; // Create a copy of the users array
          updatedUsers[user] = { ...updatedUsers[user], ...updatedUserDetails }; // Update the specific user
          setUsers(updatedUsers); // Set the new updated users list
          
          // Reset or close the user form
          
          }
          setClick(false);
        })
        .catch((error) => {
          console.error('Error updating user:', error);
          alert('Failed to update user');  // Handle errors
        });
    } else {
        alert('No user selected to update');
    }
}


  // Delete user
  function deleteuser() {
      // Ensure that a user is selected
      if (user >= 0) {
          // Confirm if the user really wants to delete
          if (window.confirm('Are you sure you want to delete this user?')) {
              console.log("Deleting user with ID:", users[user].id);
  
              // Send the DELETE request to the backend
              fetch(`/deleteuser/${users[user].id}`, {
                  method: 'DELETE',  // Use DELETE to remove the user
              })
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Failed to delete user');
                  }
                  return response.json();  // Parse the JSON response from the backend
              })
              .then(data => {
                  console.log('User deleted successfully:', data);
                  alert('User deleted successfully');
  
                  // Remove the user from the local state after successful deletion
                  const updatedUsers = users.filter((_, index) => index !== user); // Filter out the deleted user
                  setUsers(updatedUsers);  // Update the users state
  
                  // Reset the selected user and close the form
                  setuser(-1);
                  setClick(false);
              })
              .catch((error) => {
                  console.error('Error deleting user:', error);
                  alert('Error deleting user');
              });
          }
      } 
  }
  
 function openuser(index){
     setuser(index);
     setClick(true);
 }

  return (
    <div className="App">
      <div className="Users">
        <h1>Users</h1>
        <div className="list">
          {users.length > 0 ? (
            users.map((user1, index) => (
              <div key={index} className="userCard">
                <div
                  className="userrecord"
                  onClick={() => openuser(index)}
                >
                  {user1.name}
                </div>
              </div>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>

      <div className="adUser">
        <div className="box">
          <i className="plus" onClick={() => setClick(!click)}>+</i>
          <div className={`createUser ${click ? "create" : ""}`}>
            <div className="close" onClick={() => close()}>X</div>
            <div className={`delete ${user >= 0 ? "deleted" : ""}`} onClick={deleteuser}>⛔</div>

            <input
              className="part"
              placeholder="Enter user Name"
              value={user >= 0 ? username : name}
              onChange={(event) => user >= 0 ? setusername(event.target.value) : setname(event.target.value)}
            />

            <input
              className="part"
              type="email"
              placeholder="Enter user Email"
              value={user >= 0 ? useremail : email}
              readOnly={user >= 0}  // Make email read-only for existing users
              onChange={(event) => setemail(event.target.value)} // Can change email for new users only
            />

            <input
              className="part"
              type="password"
              placeholder="Enter user password"
              value={user >= 0 ? userpassword : password}
              onChange={(event) => user >= 0 ? setuserpassword(event.target.value) : setpassword(event.target.value)}
            />

            <div className="part">
              <input
                type="checkbox"
                name="read"
                checked={user < 0 ? read : userread}
                onChange={() => user < 0 ? setRead(!read) : setuserRead(!userread)}
              />
              <label htmlFor="read">Read</label>
            </div>

            <div className="part">
              <input
                type="checkbox"
                name="write"
                checked={user < 0 ? write : userwrite}
                onChange={() => user < 0 ? setWrite(!write) : setuserWrite(!userwrite)}
              />
              <label htmlFor="write">Write</label>
            </div>

            <div className="part">
              <input
                type="checkbox"
                name="readwrite"
                checked={user < 0 ? readwrite : userreadwrite}
                onChange={() => user < 0 ? setReadWrite(!readwrite) : setuserReadWrite(!userreadwrite)}
              />
              <label htmlFor="readwrite">Read and Write</label>
            </div>

            <div className="part">
              <input
                type="checkbox"
                name="activateUser"
                checked={user < 0 ? active : useractive}
                onChange={() => user < 0 ? setActive(!active) : setuserActive(!useractive)}
              />
              <label htmlFor="activateUser">Activate User</label>
            </div>

            <button
              className="part"
              type="submit"
              onClick={() => user < 0 ? sent() : updateuser()}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
