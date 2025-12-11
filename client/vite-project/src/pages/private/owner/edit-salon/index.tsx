import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import PageTitle from "@/components/ui/page-title";
import SalonForm from "@/components/ui/functional/salon-form";
import { backendUrl } from "@/constants";
import type { ISalon } from "@/interfaces";

export function EditSalonPage() {
  const { id } = useParams();
  const [salon, setSalon] = useState<ISalon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(`${backendUrl}/api/salons/get-salon-by-id/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data?.success) {
          setSalon(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSalon();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!salon) {
    return <div>Salon not found</div>;
  }

  return (
    <div>
      <PageTitle title="Edit Salon" />
      <SalonForm formType="edit" initialValues={salon} />
    </div>
  );
}

export default EditSalonPage;