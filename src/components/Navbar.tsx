import { useEffect, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";

import { auth, storage } from "../firebase";
import IconLogout from "../assets/images/logout.svg";
import { Link } from "react-router-dom";

const logoStorage = import.meta.env.VITE_FIREBASE_STORAGE_LOGO;
const appName = import.meta.env.VITE_APP_NAME;

const Navbar = () => {
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    const storageRef = ref(storage, logoStorage);

    getDownloadURL(storageRef)
      .then((url) => {
        setLogoUrl(url);
      })
      .catch((error) => {
        console.error("Error getting image URL:", error);
      });
  }, []);

  const logout = async () => {
    auth.signOut();
  };

  return (
    <nav className="navbar border-bottom sticky-top bg-white mb-md-3 mb-2">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">
          {logoUrl && (
            <Link to="/" title="Go home">
              <img
                src={logoUrl}
                alt="Logo"
                height="24"
                className="d-inline-block align-text-top pe-2"
              />
            </Link>
          )}
          <Link to="/" className="navbar-brand" title="Go home">
            {appName}
          </Link>
        </span>
        <div>
          {/* <span className="navbar-text me-2">{getDisplayName()}</span> */}
          <button
            className="btn btn-light btn-sm"
            onClick={logout}
            title="Logout"
          >
            <img src={IconLogout} alt="Logout" height="20" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
