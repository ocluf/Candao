import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../Button";
import { Card } from "../Card";
import { ClaimStep } from "./ClaimSteps";

export type ProfileFormFields = {
  name: string;
  description: string;
};

export const ProfileForm: React.FC<{
  onSubmit: (form: ProfileFormFields) => void;
  working: boolean;
  initialName: string;
  initialDescription: string;
}> = ({ onSubmit, working, initialName, initialDescription }) => {
  const { register, handleSubmit } = useForm<ProfileFormFields>();

  return (
    <Card className="flex-1">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-8">
        Who are you?
      </h3>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              {...register("name")}
              autoComplete="name"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
              defaultValue={initialName}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            About
          </label>
          <div className="mt-1">
            <textarea
              {...register("description")}
              rows={3}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              defaultValue={initialDescription}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Brief description of your role in this DAO.
          </p>
        </div>
        <div className="text-right mt-6">
          <Button type="submit" working={working}>
            {working ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
