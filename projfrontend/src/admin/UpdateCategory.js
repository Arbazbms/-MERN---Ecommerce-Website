import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper";
import { Link } from "react-router-dom";
import { updateCategory, getCategory } from "./helper/adminapicall";

const UpdateCategory = ({ match }) => {
  const [name, setName] = useState("");
  const [allName, setJs] = useState("");

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const goBack = () => (
    <div className="mt-5">
      <Link className="btn btn-sm btn-info mb-3" to="/admin/dashboard">
        Admin Home
      </Link>
    </div>
  );

  const preload = (categoryId) => {
    getCategory(categoryId).then((data) => {
      console.log(data);
      if (data?.error) {
        setError("");
      } else {
        setName(data.name);
        setJs(data);
      }
    });
  };

  useEffect(() => {
    preload(match.params.categoryId);
  }, []);

  const handleChange = (event) => {
    setError("");
    setName(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    const { user, token } = isAuthenticated(); //desructuring the data form isAuthenticated function

    //backend request fired
    updateCategory(match.params.categoryId, user._id, token, allName).then(
      (data) => {
        if (data?.error) {
          setError(true);
        } else {
          setError("");
          setSuccess(true);
          setName(""); //to clear the textBox
        }
      }
    );
  };

  const mySuccessMessage = () => {
    if (success) {
      return <h4 className="text-success">Update Category</h4>;
    }
  };

  const myWarningMessage = () => {
    if (error) {
      return <h4 className="text-success">Failed to Update Category</h4>;
    }
  };

  const myCategoryForm = () => (
    <form>
      <div className="form-group">
        <p className="lead"> Enter the Category</p>
        <input
          type="text"
          className="form-control my-3"
          onChange={handleChange}
          value={name}
          autoFocus
          required
          placeholder="For Ex. Summer"
        />
        <button onClick={onSubmit} className="btn btn-outline-info">
          Update Category
        </button>
      </div>
    </form>
  );

  return (
    <Base
      title="Create a category here"
      description="Add a new Category for a tshirts"
      className="container bg-info p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {mySuccessMessage()}
          {myWarningMessage()}
          {myCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateCategory;
