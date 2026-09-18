import SalonForm from "@/components/ui/functional/salon-form";
import PageTitle from "@/components/ui/page-title";

export function AddSalonPage() {
    return (
        <div className="mx-auto w-full max-w-5xl space-y-5">
            <div className="mx-auto w-full max-w-4xl">
                <PageTitle title="Add New Salon" />
            </div>
            <div className="private-page-card mx-auto w-full max-w-4xl">
                <SalonForm formType="add" initialValues={{}} />
            </div>
        </div>
    );
}

export default AddSalonPage;