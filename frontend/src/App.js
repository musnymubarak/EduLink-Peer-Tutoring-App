import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AboutUs from './components/Aboutus';
import ContactUs from './components/Contactus';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/dashboard/student/Dashboard';
import Profile from './components/dashboard/student/Profile';
import Subjects from './components/dashboard/student/Subjects';
import Schedule from './components/dashboard/student/Schedule';
import EnrolledSubjects from './components/dashboard/student/EnrolledSubjects';
import Resources from './components/dashboard/student/Resources';
import Requests from './components/dashboard/tutor/Requests';
import YourSubjects from './components/dashboard/tutor/YourSubjects';
import SubjectDetails from './components/dashboard/student/SubjectDetails';
import TDashboard from './components/dashboard/tutor/TDashboard';
import TProfile from './components/dashboard/tutor/TProfile';
import TSubjects from './components/dashboard/tutor/TSubjects';
import TSchedule from './components/dashboard/tutor/TSchedule';
import TSubjectDetails from './components/dashboard/tutor/TSubjectDetails';

import AdminDashboard from './components/dashboard/admin/AdminDashboard';
import DashboardOverview from './components/dashboard/admin/Pages/DashboardOverview';
import ManageSubjects from './components/dashboard/admin/Pages/AddSubject';
import ManageStudents from './components/dashboard/admin/Pages/AddStudent';
import ManageTutors from './components/dashboard/admin/Pages/AddTutor';
import NotificationPage from './components/dashboard/admin/Pages/NotificationPage';

import AddStudent from './components/dashboard/admin/Pages/AddStudent';
import ListStudent from './components/dashboard/admin/Pages/ListStudent';
import AddSubject from './components/dashboard/admin/Pages/AddSubject';
import ListSubject from './components/dashboard/admin/Pages/ListSubject';
import AddTutor from './components/dashboard/admin/Pages/AddTutor';
import ListTutor from './components/dashboard/admin/Pages/ListTutor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>

        {/*student*/}
        <Route path='/dashboard/student/' element={<Dashboard/>}/>
        <Route path='/dashboard/student/profile' element={<Profile/>}/>
        <Route path='/dashboard/student/subjects' element={<Subjects/>}/>
        <Route path='/dashboard/student/schedule' element={<Schedule/>}/>
        <Route path='/dashboard/student/enrolled-courses' element={<EnrolledSubjects/>}/>
        <Route path='/dashboard/student/resources' element={<Resources/>}/>
        <Route path="/dashboard/student/subjectData/:id" element={<SubjectDetails />} />

        {/*tutor*/}
        <Route path='/dashboard/tutor' element={<TDashboard/>}/>
        <Route path='/dashboard/tutor/profile' element={<TProfile/>}/>
        <Route path='/dashboard/tutor/subjects' element={<TSubjects/>}/>
        <Route path='/dashboard/tutor/schedule' element={<TSchedule/>}/>
        <Route path="/dashboard/tutor/subject/:id" element={<TSubjectDetails/>} />
        <Route path='/dashboard/tutor/requests' element={<Requests/>}/>
        <Route path='/dashboard/tutor/your-subjects' element={<YourSubjects/>}/>

        {/* admin */}
        <Route path='/dashboard/admin/AdminDashboard' element={<AdminDashboard/>}/>
        <Route path='/dashboard/admin/Pages/DashboardOverview' element={<DashboardOverview/>}/>
        <Route path='/dashboard/admin/Pages/ManageSubjects' element={<ManageSubjects/>}/>
        <Route path='/dashboard/admin/Pages/ManageStudents' element={<ManageStudents/>}/>
        <Route path='/dashboard/admin/Pages/ManageTutors' element={<ManageTutors/>}/>
        <Route path='/dashboard/admin/Pages/NotificationPage' element={<NotificationPage/>}/>

        <Route path='/dashboard/admin/Pages/AddStudent' element={<AddStudent/>}/>
        <Route path='/dashboard/admin/Pages/ListStudent' element={<ListStudent/>}/>
        <Route path='/dashboard/admin/Pages/AddSubject' element={<AddSubject/>}/>
        <Route path='/dashboard/admin/Pages/ListSubject' element={<ListSubject/>}/>
        <Route path='/dashboard/admin/Pages/AddTutor' element={<AddTutor/>}/>
        <Route path='/dashboard/admin/Pages/ListTutor' element={<ListTutor/>}/>
        
      </Routes>
    </Router>
  );
}

export default App;
