import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import passReducer from './slices/passSlice';
import activityReducer from './slices/activitySlice';
import promoCodeReducer from './slices/promoCodeSlice';
import volunteerReducer from './slices/volunteerSlice';
import exhibitorReducer from './slices/exhibitorSlice';
import bookingReducer from './slices/bookingSlice';
import settingsReducer from './slices/settingsSlice';
import sponsorReducer from './slices/sponsorSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    passes: passReducer,
    activities: activityReducer,
    promoCodes: promoCodeReducer,
    volunteers: volunteerReducer,
    exhibitors: exhibitorReducer,
    bookings: bookingReducer,
    settings: settingsReducer,
    adminSponsors: sponsorReducer,
  },
});

export default store;

