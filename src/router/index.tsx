import { createBrowserRouter, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "@/pages/Home/index";
import { StudentDashboard } from "@/pages/StudentDashboard/index";
import { TeacherDashboard } from "@/pages/TeacherDashboard/index";
import { HelpOthers } from "@/pages/HelpOthers/index";
import { FindOut } from "@/pages/FindOut/index";
import { Splash } from "@/pages/Splash/index";
import { AboutUs } from "@/pages/AboutUs/index";

function SplashThenHome() {
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/home", { replace: true });
        }, 4100); // show splash for ~4 seconds before going to /home
        return () => clearTimeout(timer);
    }, [navigate]);
    return <Splash />;
}

const routes = [
    {
        path: "/splash",
        element: <Splash />
    },
    {
        path: "/home",
        element: <Home />
    },
    {
        path: "/",
        element: <SplashThenHome />
    },
    {
        path: "/student",
        element: <StudentDashboard />
    },
    {
        path: "/teacher",
        element: <TeacherDashboard />
    },
    {
        path: "/help-others",
        element: <HelpOthers />
    },
    {
        path: "/find-out",
        element: <FindOut />
    },
    {
        path: "/about",
        element: <AboutUs />
    },
]

export const router = createBrowserRouter(routes);

