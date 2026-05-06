import { SettingsLayout } from "@/components/settings/components/modules";
import FadeInWrapper from "@/components/shared/FadeInWrapper";
import { Heading5 } from "@/components/shared/Text";

export default function SettingsPage() {
  return (
    <FadeInWrapper>
      <div className="bg-neutral-weak lg:bg-custom-weak-100 w-full h-full lg:px-10 lg:pt-10">
        {/* Desktop heading — SettingsLayout handles its own mobile heading */}
        <div className="hidden lg:block">
          <Heading5>Account Settings</Heading5>
        </div>
        <SettingsLayout />
      </div>
    </FadeInWrapper>
  );
}
