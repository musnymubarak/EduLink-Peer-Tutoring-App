import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ExploreSubjects() {

    const [subjects, setSubjects] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    const navigate = useNavigate();

    useEffect(() => {
      const fetchSubjects = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/v1/courses"
          ); // Replace our true end point
          setSubjects(response.data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching subjects:", err);
          setError("Failed to load subjects. Please try again later.");
          setLoading(false);
        }
      };

      fetchSubjects();
    }, []);
}