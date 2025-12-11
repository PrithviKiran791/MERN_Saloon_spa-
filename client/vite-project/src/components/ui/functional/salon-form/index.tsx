import type { ISalon } from "@/interfaces";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { backendUrl } from "@/constants";
import Cookies from "js-cookie";
import LocationSelection from "./location-selection";

axios.defaults.withCredentials = true;

export const formSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100),
    address: z.string().trim().min(5, "Address is required"),
    city: z.string().trim().min(2, "City is required"),
    state: z.string().trim().min(2, "State is required"),
    zip: z.string().trim().regex(/^\d{5,6}$/, "Invalid zip code"),
    minimumServicePrice: z.number().positive("Must be greater than 0"),
    maximumServicePrice: z.number().positive("Must be greater than 0"),
    offerStatus: z.boolean(),
    workingDays: z.array(z.string()),
    startTime: z.string(),
    endTime: z.string(),
    breakStartTime: z.string(),
    breakEndTime: z.string(),
    slotDuration: z.number().positive("Must be greater than 0"),
    maxBookingPerSlot: z.number().positive("Must be greater than 0"),
    locationInMap: z.object({}).optional(),
    isActive : z.boolean().optional(),
});

function SalonForm({ formType, initialValues }: { formType: 'add' | 'edit'; initialValues?: Partial<ISalon> }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<any>(initialValues?.locationInMap || null);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialValues?.name || "",
            address: initialValues?.address || "",
            city: initialValues?.city || "",
            state: initialValues?.state || "",
            zip: initialValues?.zipCode || "",
            minimumServicePrice: initialValues?.minimumServicePrice || 0,
            maximumServicePrice: initialValues?.maximumServicePrice || 0,
            offerStatus: initialValues?.offerStatus === 'active',
            workingDays: initialValues?.workingDays || [],
            startTime: initialValues?.startTime || "",
            endTime: initialValues?.endTime || "",
            breakStartTime: initialValues?.breakStartTime || "",
            breakEndTime: initialValues?.breakEndTime || "",
            slotDuration: initialValues?.slotDuration || 30,
            maxBookingPerSlot: initialValues?.maxBookingPerSlot || 1,
            locationInMap: initialValues?.locationInMap || {},
            isActive: initialValues?.isActive !== false,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            const token = Cookies.get("token");
            if (!token) {
                toast.error("Unauthorized: No token found");
                return;
            }

            const salonData = {
                name: values.name,
                address: values.address,
                city: values.city,
                state: values.state,
                zipCode: values.zip,
                minimumServicePrice: values.minimumServicePrice,
                maximumServicePrice: values.maximumServicePrice,
                offerStatus: values.offerStatus ? 'active' : 'inactive',
                workingDays: values.workingDays,
                startTime: values.startTime,
                endTime: values.endTime,
                breakStartTime: values.breakStartTime,
                breakEndTime: values.breakEndTime,
                slotDuration: values.slotDuration,
                maxBookingPerSlot: values.maxBookingPerSlot,
                locationInMap: selectedLocation || values.locationInMap,
                isActive: values.isActive,
            };

            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            if (formType === 'add') {
                const response = await axios.post(
                    `${backendUrl}/salons/create-salon`,
                    salonData,
                    { headers, withCredentials: true }
                );
                
                if (response.status === 201 || response.status === 200) {
                    toast.success("Salon created successfully!");
                    setTimeout(() => navigate("/owner/salons"), 1500);
                }
            } else {
                const response = await axios.put(
                    `${backendUrl}/salons/update-salon-by-id/${initialValues?._id}`,
                    salonData,
                    { headers, withCredentials: true }
                );
                
                if (response.status === 200) {
                    toast.success("Salon updated successfully!");
                    setTimeout(() => navigate("/owner/salons"), 1500);
                }
            }
        } catch (error) {
            console.error("Error submitting salon:", error);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to save salon. Please try again.");
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-4xl">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Salon Name & City */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Salon Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter salon name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter city" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Address */}
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* State & Zip Code */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter state" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="zip"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Zip Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter zip code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Minimum & Maximum Service Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="minimumServicePrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Minimum Service Price</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            placeholder="Enter minimum price" 
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="maximumServicePrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Maximum Service Price</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            placeholder="Enter maximum price" 
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Times & Slots */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="breakStartTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Break Start Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="breakEndTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Break End Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="slotDuration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slot Duration (minutes)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxBookingPerSlot"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Bookings Per Slot</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Offer Status Select */}
                    <FormField
                        control={form.control}
                        name="offerStatus"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Offer Status</FormLabel>
                                <Select onValueChange={(value) => field.onChange(value === "active")} defaultValue={field.value ? "active" : "inactive"}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select offer status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Working Days Section */}
                    <FormField
                        control={form.control}
                        name="workingDays"
                        render={({ field }) => (
                            <FormItem className="border-t pt-6">
                                <FormLabel>Working Days</FormLabel>
                                <div className="grid md:grid-cols-4 gap-2">
                                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => {
                                        const value = field.value || [];
                                        const checked = value.includes(day);
                                        return (
                                            <label key={day} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 bg-muted/40 cursor-pointer">
                                                <Checkbox
                                                    checked={checked}
                                                    onCheckedChange={(state) => {
                                                        const next = state ? [...value, day] : value.filter((d: string) => d !== day);
                                                        field.onChange(next);
                                                    }}
                                                />
                                                <span className="text-sm">{day}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Location Selection Section */}
                    <div className="border-t pt-6">
                        <FormLabel className="text-base font-semibold mb-4 block">Select Salon Location on Map</FormLabel>
                        <LocationSelection
                            selectedLocationObject={selectedLocation}
                            setSelectedLocationObject={setSelectedLocation}
                            hideMap={false}
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Submitting..." : formType === 'add' ? "Create Salon" : "Update Salon"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default SalonForm;