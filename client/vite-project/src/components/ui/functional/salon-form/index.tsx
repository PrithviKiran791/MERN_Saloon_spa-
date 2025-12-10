import type { ISalon } from "@/interfaces";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "../../textarea";


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
    minimumServiceCharge: z.number().positive("Must be greater than 0"),
    maximumServiceCharge: z.number().positive("Must be greater than 0"),
    offerStatus: z.boolean(),
    workingDays: z.array(z.string()),
    endTime: z.string(),
    breakStartTime: z.string(),
    breakEndTime: z.string(),
    slotDuration: z.number().positive("Must be greater than 0"),
    maxBookingPerSlot: z.number().positive("Must be greater than 0"),
    locationInMap: z.object({}).optional(),
    isActive : z.boolean().optional(),
});
import axios from "axios";

axios.defaults.withCredentials = true;
function SalonForm({ formType, initialValues }: { formType: 'add' | 'edit'; initialValues?: Partial<ISalon> }) {
    console.log("SalonForm", formType, initialValues);
   
    const [loading, setLoading] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialValues?.name || "",
            address: initialValues?.address || "",
            city: initialValues?.city || "",
            state: initialValues?.state || "",
            zip: initialValues?.zipCode || "",
            minimumServiceCharge: initialValues?.minimumServiceCharge || 0,
            maximumServiceCharge: initialValues?.maximumServiceCharge || 0,
            offerStatus: initialValues?.offerStatus === 'active',
            workingDays: initialValues?.workingDays || [],
            endTime: "",
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
            console.log("Submitting salon form:", values);
            // TODO: Add API call here
        } catch (error) {
            console.error("Error submitting form:", error);
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
                            name="minimumServiceCharge"
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
                            name="maximumServiceCharge"
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
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">Working Days & Hours</h3>
                        
                        <div className="space-y-4">
                            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                                <div key={day} className="border rounded-lg p-4 bg-slate-50">
                                    <div className="flex items-center mb-3">
                                        <Checkbox 
                                            id={day}
                                            className="mr-3"
                                        />
                                        <label htmlFor={day} className="font-medium cursor-pointer">{day}</label>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-6">
                                        <FormItem>
                                            <FormLabel className="text-sm">Start Time</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="time"
                                                    placeholder="Start time"
                                                />
                                            </FormControl>
                                        </FormItem>

                                        <FormItem>
                                            <FormLabel className="text-sm">End Time</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="time"
                                                    placeholder="End time"
                                                />
                                            </FormControl>
                                        </FormItem>

                                        <FormItem>
                                            <FormLabel className="text-sm">Break Start Time</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="time"
                                                    placeholder="Break start time"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    </div>
                                </div>
                            ))}
                        </div>
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