import { useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import { useAccountType } from "./dashboard/AccountTypeContext";
import {
  auth,
  googleProvider,
  signInWithPopup,
  db,
} from "../../src/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./css/Login.css";

