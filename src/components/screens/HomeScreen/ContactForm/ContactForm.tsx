import { slugify } from "@helpers/slugify";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvenueLink, Button } from "@primitives";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Icon, { IconNameOptions } from "@primitives/Icon/Icon";

import SelectInput from "./SelectInput";
import TextInput from "./TextInput";

const ContactLink = ({
  icon,
  heading,
  href,
  value,
  ariaLabel,
  target,
  rel,
}: {
  icon: IconNameOptions;
  heading: string;
  href: string;
  value: string;
  ariaLabel?: string;
  target?: string;
  rel?: string;
}) => {
  return (
    <div className="relative flex gap-2 md:gap-3">
      <Icon
        name={icon}
        className="icon-color-(--ContactForm-Icon) size-4 md:size-5"
      />
      <div>
        <h5 className="typography-eyebrow">{heading}</h5>
        <a
          href={href}
          className="typography-bodyLarge expand-pseudo font-bold hover:underline"
          aria-label={ariaLabel}
          target={target}
          rel={rel}
        >
          {value}
        </a>
      </div>
    </div>
  );
};

export const ausPhoneRegex =
  // eslint-disable-next-line no-useless-escape
  /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$/gm;

export const formSchema = z.object({
  name: z.string().min(1, { message: "Please enter your name" }),

  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().regex(ausPhoneRegex, {
    message: "Please enter a valid phone number",
  }),

  service: z.string().min(1, { message: "Please select an option" }),
  message: z.string().optional(),
  website: z.string().optional(),
  submittedAt: z.number().optional(),
});
type Inputs = z.TypeOf<typeof formSchema>;

const Form = ({ selectOptions, button, setIsSubmitted }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedAt] = useState<number>(() => Date.now());
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   name: "Test User",
    //   email: "test@example.com",
    //   phone: "0400000000",
    //   service: selectOptions?.[0] || "General enquiry",
    //   message: "This is a test enquiry from localhost.",
    // },
  });

  const onSubmit = async (data: Inputs) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.service,
          message: data.message || "",
          website: data.website || "",
          submittedAt: data.submittedAt,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        setSubmitError(
          "Something went wrong sending your enquiry. Please try again."
        );
        return;
      }

      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        "Something went wrong sending your enquiry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="mt-1 space-y-3"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <TextInput label="Name" name="name" register={register} errors={errors} />
      <TextInput
        label="Phone number"
        name="phone"
        register={register}
        errors={errors}
      />
      <TextInput
        label="Email"
        name="email"
        type="email"
        register={register}
        errors={errors}
      />

      <SelectInput
        label="Service"
        options={selectOptions}
        name="service"
        control={control}
        errors={errors}
      />
      <TextInput
        label="Message"
        name="message"
        type="textarea"
        register={register}
        errors={errors}
      />
      <input
        type="hidden"
        {...register("submittedAt", { value: submittedAt })}
        value={submittedAt}
      />
      <div className="hidden" aria-hidden>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          aria-label="Leave this field empty"
          {...register("website")}
        />
      </div>

      <Button
        type="submit"
        className=""
        disabled={isSubmitting}
        icon={{ name: isSubmitting ? "spinner" : "arrow_right_circle_filled" }}
      >
        {button || "Submit"}
      </Button>
      {submitError && (
        <p
          className="typography-bodySmall text-[red]"
          role="alert"
          aria-live="polite"
        >
          {submitError}
        </p>
      )}
    </form>
  );
};

const SocialLink = ({ icon, href }: any) => {
  return (
    <AvenueLink href={href}>
      <Icon
        name={icon}
        className="icon-color-(--ContactForm-SocialIcon) hover-opacity size-4"
      />
    </AvenueLink>
  );
};

const TextSection = ({
  phone,
  email,
  address,
  instagram,
  facebook,
  linkedIn,
}: any) => {
  return (
    <div className="flex flex-col gap-3 md:gap-5 md:pl-10">
      <ContactLink
        icon="phone_filled"
        heading="Call us on"
        value={phone}
        href={`tel:${phone}`}
        ariaLabel={`Call ${phone}`}
      />
      <ContactLink
        icon="email"
        heading="Email us at"
        value={email}
        href={`mailto:${email}`}
        ariaLabel={`Email ${email}`}
      />
      <ContactLink
        icon="pin"
        heading="Find us at"
        value={address}
        target="_blank"
        rel="noopener noreferrer"
        href={`https://maps.google.com/?q=${address}`}
        ariaLabel={`Open map for ${address}`}
      />
      <div className="md:pl-73 pl-56">
        <h5 className="typography-eyebrow mb-12">Our Socials</h5>

        <div className="flex gap-3">
          {instagram && <SocialLink icon="social_instagram" href={instagram} />}
          {facebook && <SocialLink icon="social_facebook" href={facebook} />}
          {linkedIn && <SocialLink icon="social_linkedin" href={linkedIn} />}
        </div>
      </div>
    </div>
  );
};

export default function ContactForm({
  navigationLabel,
  heading,
  description,
  selectOptions,
  button,
  contactInfo,
}: {
  navigationLabel: string;
  heading: string;
  description?: string;
  selectOptions?: string[];
  button?: string;
  contactInfo: any;
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div
      id={slugify(navigationLabel)}
      className="bg-(--ContactForm-SectionBg) py-5 md:py-10"
    >
      <div className="main-column grid gap-4 md:grid-cols-[4fr_2fr]">
        {isSubmitted ? (
          <div className="flex flex-col gap-2 md:gap-3">
            <h2 className="typography-h2">{contactInfo.successMessageText1}</h2>
            <p className="typography-bodyLarge">
              {contactInfo.successMessageText2}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 md:gap-3">
            <h2 className="typography-h2">{heading}</h2>
            {description && (
              <p className="typography-bodyLarge">{description}</p>
            )}

            <Form
              selectOptions={selectOptions}
              button={button}
              setIsSubmitted={setIsSubmitted}
            />
          </div>
        )}

        <TextSection {...contactInfo} />
      </div>
    </div>
  );
}
