import PageTitle from "@/components/ui/page-title";
import { Calendar, MapPin, Users, Zap, ArrowUpRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Ripple } from "@/components/ui/ripple";

function UserDashboardPage() {
  return (
    <div className="relative space-y-8">
      <Ripple 
        mainCircleSize={200}
        mainCircleOpacity={0.2}
        numCircles={6}
      />
      <div className="relative z-10">
      {/* Back to Home Button */}
      <div className="flex items-center justify-between mb-4">
        <PageTitle title="Dashboard" />
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-black/30 bg-black/5 hover:bg-black/10 text-black text-sm font-medium transition-all hover:scale-105"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-black via-slate-800 to-black rounded-xl shadow-lg p-8 text-white border border-white/20 hover:shadow-xl transition-shadow">
        <h2 className="text-4xl font-bold mb-2">Welcome Back!</h2>
        <p className="text-white/80 text-lg">Discover premium salon services in your area</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/user/salons"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition-all hover:shadow-lg hover:scale-105"
          >
            Browse Salons
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            to="/user/appointments"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/40 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            View Appointments
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            to="/user/profile"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/40 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            Profile Settings
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <div className="group bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <Calendar className="w-6 h-6 text-black group-hover:text-white" />
            </div>
            <span className="text-3xl font-bold text-black">0</span>
          </div>
          <p className="text-black font-semibold">Upcoming Appointments</p>
          <p className="text-gray-600 text-sm mt-1">Your next bookings</p>
          <Link to="/user/appointments" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-black hover:text-black/70 transition-colors group/link">
            View appointments <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
          </Link>
        </div>

        {/* Stat Card 2 */}
        <div className="group bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <MapPin className="w-6 h-6 text-black group-hover:text-white" />
            </div>
            <span className="text-3xl font-bold text-black">0</span>
          </div>
          <p className="text-black font-semibold">Favorite Salons</p>
          <p className="text-gray-600 text-sm mt-1">Your saved places</p>
          <Link to="/user/salons" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-black hover:text-black/70 transition-colors group/link">
            Browse salons <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
          </Link>
        </div>

        {/* Stat Card 3 */}
        <div className="group bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <Users className="w-6 h-6 text-black group-hover:text-white" />
            </div>
            <span className="text-3xl font-bold text-black">0</span>
          </div>
          <p className="text-black font-semibold">Completed Services</p>
          <p className="text-gray-600 text-sm mt-1">Finished bookings</p>
          <Link to="/user/appointments" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-black hover:text-black/70 transition-colors group/link">
            View history <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
          </Link>
        </div>

        {/* Stat Card 4 */}
        <div className="group bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <Zap className="w-6 h-6 text-black group-hover:text-white" />
            </div>
            <span className="text-3xl font-bold text-black">0</span>
          </div>
          <p className="text-black font-semibold">Active Offers</p>
          <p className="text-gray-600 text-sm mt-1">Special promotions</p>
          <Link to="/user/salons" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-black hover:text-black/70 transition-colors group/link">
            View offers <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Get Started Section */}
      <div className="bg-white/95 rounded-xl shadow-md p-8 border border-black/10">
        <h3 className="text-2xl font-bold text-black mb-4">Getting Started</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
            <div>
              <p className="font-semibold text-black">Browse Salons</p>
              <p className="text-black/60 text-sm">Explore nearby salons and services</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
            <div>
              <p className="font-semibold text-black">Select Service</p>
              <p className="text-black/60 text-sm">Choose your preferred service</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
            <div>
              <p className="font-semibold text-black">Book Now</p>
              <p className="text-black/60 text-sm">Confirm your appointment</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default UserDashboardPage;
