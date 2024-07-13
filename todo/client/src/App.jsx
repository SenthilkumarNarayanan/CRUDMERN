import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState([]);
  const [isModleOpen, setIsModleOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "",state:"" });
  const getAllUsers = async () => {
    await axios.get("http://localhost:8000/users").then((res) => {
      console.log(res.data);
      setUsers(res.data);
      setSearch(res.data);
    });
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  const onChangeHandler = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.city.toLowerCase().includes(searchText) ||
        user.state.toLowerCase().includes(searchText) 

    );
    setSearch(filteredUsers);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure to Delete this User");
    if (isConfirmed) {
      await axios.delete(`http://localhost:8000/users/${id}`).then((res) => {
        setUsers(res.data);
        setSearch(res.data);
      });
    }
  };
  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "", state:""});
    setIsModleOpen(true);
  };

  //Close Modal
  const closeModal = () => {
    setIsModleOpen(false);
    getAllUsers();

  };
  const handleData=(e)=>{
    setUserData({...userData,[e.target.name]:e.target.value})

  };
  const handleSubmit=async(e)=>{
  e.preventDefault();
  const {name,age,city,state}= userData
  if (name && age && city && state) {
    if (!isNaN(age) && age > 0) {
      try {
        if (userData.id) {
          await axios.patch(`http://localhost:8000/users/${userData.id}`, userData);
        } else {
          await axios.post("http://localhost:8000/users", userData);
        }
        closeModal();
      } catch (error) {
        console.error("Error submitting user data:", error);
      }
    } else {
      alert("Age must be a positive number.");
    }
  } else {
    alert("All fields must be filled out.");
  }

  setUserData({ name: "", age: "", city: "", state: "" });
};

const handleUpdateRecord= (user)=>{
setUserData(user);
setIsModleOpen(true);
  }
  return (
    <>
      <div className="container">
        <h3>CRUD APP Using MERN Stack</h3>
        <div className="input-search">
          <input onChange={onChangeHandler} type="search" />
          <button className="btn green btn btn-success" onClick={handleAddRecord}>
            Add User
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>             
               <th>State</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {search &&
              search.map((user, index) => {
                return (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.city}</td>
                    <td>{user.state}</td>
                    <td>
                      <button className="btn green btn btn-success"
                      onClick={()=>handleUpdateRecord(user)}>Edit</button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="btn red btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {isModleOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <h3>{userData.id?"Update Record":"Add Record"}</h3>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" value={userData.name} onChange={handleData} name="name" id="mame" required />
              </div>
              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input type="text"value={userData.age} onChange={handleData} name="age" id="age" />
              </div>
              <div className="input-group">
                <label htmlFor="city">City</label>
                <input type="text" value={userData.city} onChange={handleData} name="city" id="city" />
              </div>
              <div className="input-group">
                <label htmlFor="state">State</label>
                <input type="text" value={userData.state} onChange={handleData} name="state" id="state" />
              </div>

              <button className="btn green btn btn-success" onClick={handleSubmit} >
              {userData.id?"Update Record":"Add Record"}
</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
