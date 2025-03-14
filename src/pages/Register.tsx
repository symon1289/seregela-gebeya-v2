import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import useUser from "../hooks/useUser";
import { setUser } from "../store/features/authSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ProfileField = ({
    value,
    name,
    onChange,
    onBlur,
    type,
    placeholder,
    label,
    htmlFor,
    id,
    pattern,
    error,
    disabled,
}: {
    id: string;
    label: string;
    value: string;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type: string;
    placeholder?: string;
    htmlFor?: string;
    pattern?: string;
    error?: string;
    disabled?: boolean;
}) => (
    <div className="relative z-0 w-full mb-5 group">
        <input
            type={type}
            name={name}
            id={id}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 disabled:cursor-not-allowed  disabled:text-gray-400 focus:border-primary peer"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            pattern={pattern}
            disabled={disabled}
            required
        />
        <label
            htmlFor={htmlFor}
            className="peer-focus:font-medium absolute text-sm text-gray-700  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-primary  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
            {label}
        </label>
        {error && <p className="text-red-500 text-xs my-2">{error}</p>}
    </div>
);
const Register: React.FC = () => {
    const userData = useSelector((state: RootState) => state.auth.user);
    const { updateUser, fetchUser } = useUser();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        user_name: "",
        city: "",
        sub_city: "",
        woreda: "",
        neighborhood: "",
        house_number: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    useEffect(() => {
        fetchUser();
        if (userData) {
            setForm((prevForm) => ({
                ...prevForm,
                phone_number: userData?.phone_number || "",
            }));
        }
    }, []);
    const validateField = (name: string, value: string) => {
        let error = "";

        switch (name) {
            case "first_name":
            case "last_name":
                if (!value.trim())
                    error = `${name.replace("_", " ")} is required`;
                else if (!/^[A-Za-z]+$/.test(value))
                    error = "Only letters allowed";
                break;

            case "email":
                if (!value.trim()) error = "Email is required";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    error = "Invalid email format";
                break;

            case "phone_number":
                if (!value.trim()) error = "Phone number is required";
                else if (!/^251[79]\d{8}$/.test(value))
                    error = "Invalid Ethiopian phone number format";
                break;

            case "user_name":
                if (!value.trim()) error = "Username is required";
                else if (value.length < 4)
                    error = "At least 4 characters required";
                break;

            case "city":
            case "sub_city":
            case "woreda":
            case "neighborhood":
            case "house_number":
                if (!value.trim())
                    error = `${name.replace("_", " ")} is required`;
                break;

            default:
                break;
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let hasError = false;

        Object.keys(form).forEach((key) => {
            validateField(key, form[key as keyof typeof form]);
            if (!form[key as keyof typeof form].trim()) hasError = true;
        });

        if (!hasError) {
            try {
                updateUser(form, form.phone_number);
                dispatch(setUser(form));
                toast.success("Profile updated successfully!");
            } catch (error) {
                console.error("Error saving user data:", error);
                toast.error("Failed to save profile.");
            }
        }
    };
    return (
        <div className="max-w-screen-xl max-sm:max-w-lg mx-auto px-6 py-2 my-2">
            <div className="text-center mb-4 sm:mb-6 items-center">
                <h4 className="text-2xl font-semibold logo-english mt-2">
                    {t("register_profile")}
                </h4>
            </div>
            <form className="max-w-3xl mx-auto" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 md:gap-6">
                    <ProfileField
                        htmlFor="first_name"
                        id="first_name"
                        label={t("first_name_hint")}
                        value={form.first_name}
                        name="first_name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        error={errors.first_name}
                        placeholder=" "
                    />

                    <ProfileField
                        htmlFor="last_name"
                        id="last_name"
                        label={t("last_name_hint")}
                        value={form.last_name}
                        name="last_name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        error={errors.last_name}
                        placeholder=" "
                    />
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                    <ProfileField
                        htmlFor="phone"
                        id="phone"
                        label={t("phone_no_hint")}
                        value={form.phone_number}
                        pattern="[0-9]{9}"
                        name="phone"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="tel"
                        error={errors.phone_number}
                        disabled
                    />

                    <ProfileField
                        htmlFor="user_name"
                        id="user_name"
                        label={t("user_name_hint")}
                        value={form.user_name}
                        name="user_name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        error={errors.user_name}
                        placeholder=" "
                    />
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-primary peer"
                        placeholder=" "
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                    <label
                        htmlFor="email"
                        className="peer-focus:font-medium absolute text-sm text-gray-700  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-primary  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        {t("email_hint")}
                    </label>
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div className="grid md:grid-cols-3 md:gap-6">
                    <ProfileField
                        htmlFor="city"
                        id="city"
                        label={t("city_hint")}
                        value={form.city}
                        name="city"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        error={errors.city}
                        placeholder=" "
                    />

                    <ProfileField
                        htmlFor="sub_city"
                        id="sub_city"
                        label={t("sub_city_hint")}
                        value={form.sub_city}
                        name="sub_city"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        error={errors.sub_city}
                        placeholder=" "
                    />

                    <ProfileField
                        htmlFor="woreda"
                        id="woreda"
                        label={t("woreda_hint")}
                        value={form.woreda}
                        name="woreda"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        error={errors.woreda}
                        placeholder=" "
                    />
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                    <ProfileField
                        htmlFor="neighborhood"
                        id="neighborhood"
                        label={t("neighborhood_hint")}
                        value={form.neighborhood}
                        name="neighborhood"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        error={errors.neighborhood}
                        placeholder=" "
                    />

                    <ProfileField
                        htmlFor="house_number"
                        id="house_number"
                        label={t("house_no_hint")}
                        value={form.house_number}
                        name="house_number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        error={errors.house_number}
                        placeholder=" "
                    />
                </div>
                <div className="flex items-center justify-center w-full">
                    <button
                        type="submit"
                        className="text-white bg-septenary tracking-wider hover:bg-white hover:text-septenary border border-septenary transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm w-full md:w-1/2 px-5 py-2.5 text-center"
                    >
                        {t("register")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;
