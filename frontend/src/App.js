import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AboutUs from './components/Aboutus';
import ContactUs from './components/Contactus';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/dashboard/Profile';
import Subjects from './components/dashboard/Subjects';
import Schedule from './components/dashboard/Schedule';
import EnrolledSubjects from './components/dashboard/student/EnrolledSubjects';
import Resources from './components/dashboard/student/Resources';
import Requests from './components/dashboard/tutor/Requests';
import YourSubjects from './components/dashboard/tutor/YourSubjects';
import SubjectDetails from './components/dashboard/SubjectDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/dashboard/profile' element={<Profile/>}/>
        <Route path='/dashboard/subjects' element={<Subjects/>}/>
        <Route path='/dashboard/schedule' element={<Schedule/>}/>
        <Route path='/dashboard/enrolled-courses' element={<EnrolledSubjects/>}/>
        <Route path='/dashboard/resources' element={<Resources/>}/>
        <Route path='/dashboard/requests' element={<Requests/>}/>
        <Route path='/dashboard/your-subjects' element={<YourSubjects/>}/>
        <Route path="/subject/:id" element={<SubjectDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
