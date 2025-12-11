import SalonForm from "@/components/ui/functional/salon-form";
import PageTitle from "@/components/ui/page-title";

export function AddSalonPage() {
    return (
        <div>
            <PageTitle title="Add New Salon" />
            <SalonForm formType="add" initialValues={{}} />
        </div>
    );
}

export default AddSalonPage;