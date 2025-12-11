import UserProfileCard from "@/components/functional/user-profile-card"
import PageTitle from "@/components/ui/page-title"
import { Ripple } from "@/components/ui/ripple";


function OwnerProfilePage() {
  return (
    <div className="relative">
      <Ripple 
        mainCircleSize={200}
        mainCircleOpacity={0.2}
        numCircles={6}
      />
      <div className="relative z-10">
      <PageTitle title="Profile" />
      <UserProfileCard />
      </div>
    </div>
  )
}

export default OwnerProfilePage