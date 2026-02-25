import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserData } from '../redux/userSlice'
import {toast} from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { IoPersonOutline, IoLockClosedOutline, IoNotificationsOutline, IoShieldCheckmarkOutline, IoHelpCircleOutline, IoInformationCircleOutline, IoBrushOutline, IoLogOutOutline, IoChevronForward, IoKeyOutline, IoMailOutline, IoGlobeOutline, IoMoonOutline, IoSunnyOutline } from 'react-icons/io5'
import { MdPrivacyTip, MdReportProblem } from 'react-icons/md'
import { FaInstagram } from 'react-icons/fa'
import Navbar from './navbar'
import { toggleTheme } from '../redux/themeSlice'

const Settings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    
    
    const handleLogout = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/signout`,
          {},
          { withCredentials: true },
        );
        dispatch(clearUserData());
        toast.success('Logged out successfully');
        navigate('/signin');
      } catch (error) {
        console.error("Logout error:", error);
        toast.error('Failed to logout');
      }
    };

    const SettingsSection = ({ title, children }) => (
      <div className="mb-6">
        <h2 className="text-text-muted text-xs font-semibold px-2 mb-2 uppercase tracking-wider">{title}</h2>
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          {children}
        </div>
      </div>
    );

    const SettingsItem = ({ icon: Icon, title, subtitle, onClick, danger = false, showArrow = true }) => (
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-4 transition-all duration-200 border-b border-border hover:bg-surface-hover ${
          danger ? 'text-danger' : 'text-text-primary'
        }`}
      >
        <Icon className={`text-2xl shrink-0 ${
          danger ? 'text-danger' : 'text-text-secondary'
        }`} />
        <div className="flex-1 text-left">
          <p className={`font-medium ${
            danger ? 'text-danger' : 'text-text-primary'
          }`}>{title}</p>
          {subtitle && <p className="text-text-secondary text-sm mt-0.5">{subtitle}</p>}
        </div>
        {showArrow && <IoChevronForward className="text-text-muted text-lg shrink-0" />}
      </button>
    );

  return (
    <div className="w-full min-h-screen bg-bg text-text-primary">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="text-text-primary text-2xl cursor-pointer hover:scale-110 transition-transform"
          >
            ←
          </button>
          <div>
            <h1 className="text-text-primary text-xl font-semibold">Settings</h1>
            <p className="text-text-secondary text-sm">@{userData?.username}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
        
        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsItem
            icon={IoPersonOutline}
            title="Edit Profile"
            subtitle="Change your name, bio, and profile picture"
            onClick={() => navigate('/edit-profile')}
          />
          <SettingsItem
            icon={IoKeyOutline}
            title="Change Password"
            subtitle="Update your password"
            onClick={() => toast('Feature coming soon')}
          />
          <SettingsItem
            icon={IoMailOutline}
            title="Email Address"
            subtitle={userData?.email}
            onClick={() => toast('Feature coming soon')}
          />
        </SettingsSection>

        {/* Privacy & Security Section */}
        <SettingsSection title="Privacy & Security">
          <SettingsItem
            icon={MdPrivacyTip}
            title="Account Privacy"
            subtitle="Manage who can see your content"
            onClick={() => toast('Feature coming soon')}
          />
          <SettingsItem
            icon={IoShieldCheckmarkOutline}
            title="Story Settings"
            subtitle="Control who can view your stories"
            onClick={() => toast('Feature coming soon')}
          />
          <SettingsItem
            icon={IoLockClosedOutline}
            title="Blocked Accounts"
            subtitle="Manage blocked users"
            onClick={() => toast('Feature coming soon')}
          />
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title="Notifications">
          <SettingsItem
            icon={IoNotificationsOutline}
            title="Push Notifications"
            subtitle="Manage notification preferences"
            onClick={() => toast('Feature coming soon')}
          />
          <SettingsItem
            icon={IoMailOutline}
            title="Email Notifications"
            subtitle="Control email updates"
            onClick={() => toast('Feature coming soon')}
          />
        </SettingsSection>

        {/* Display & Accessibility */}
        <SettingsSection title="Display & Accessibility">
          <SettingsItem
            icon={theme === 'dark' ? IoMoonOutline : IoSunnyOutline}
            title="Theme"
            subtitle={`Currently using ${theme === 'dark' ? 'Dark' : 'Light'} mode`}
            onClick={() => dispatch(toggleTheme())}
          />
          <SettingsItem
            icon={IoGlobeOutline}
            title="Language"
            subtitle="English (US)"
            onClick={() => toast('Feature coming soon')}
          />
        </SettingsSection>

        {/* Help & Support Section */}
        <SettingsSection title="Help & Support">
          <SettingsItem
            icon={IoHelpCircleOutline}
            title="Help Center"
            subtitle="Get help with your account"
            onClick={() => toast('Feature coming soon')}
          />
          <SettingsItem
            icon={MdReportProblem}
            title="Report a Problem"
            danger={true}
            subtitle="Let us know if something isn't working"
            onClick={() => toast('Feature coming soon')}
          />
        </SettingsSection>

        {/* About Section */}
        <SettingsSection title="About">
          <SettingsItem
            icon={IoInformationCircleOutline}
            title="Terms of Service"
            subtitle="Read our terms"
            onClick={() => toast('Feature coming soon')}
          />
          <SettingsItem
            icon={MdPrivacyTip}
            title="Privacy Policy"
            subtitle="How we handle your data"
            onClick={() => toast('Feature coming soon')}
          />
          <SettingsItem
            icon={FaInstagram}
            title="App Version"
            subtitle="1.0.0"
            onClick={() => {}}
            showArrow={false}
          />
        </SettingsSection>

        {/* Logout Button */}
        <div className="mb-6">
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <SettingsItem
              icon={IoLogOutOutline}
              title="Log Out"
              onClick={() => setShowLogoutConfirm(true)}
              danger={true}
              showArrow={false}
            />
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-500/20 p-4 rounded-full">
                <IoLogOutOutline className="text-danger text-4xl" />
              </div>
            </div>
            <h3 className="text-text-primary text-xl font-bold text-center mb-2">Log Out?</h3>
            <p className="text-text-secondary text-center mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-surface-hover text-text-primary py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:opacity-90 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Settings
