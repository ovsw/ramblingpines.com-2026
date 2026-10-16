import { getSafeLinkHref } from "@/lib/safe-href";
import { createHeaderBrandModel, createHeaderNavigationModel } from "./model";
import { Header, HeaderNavigation } from "./site-header";
import type { HeaderNavigationModel } from "./model";
import { fetchSanityNavigation, fetchSanitySettings } from "@/sanity/lib/fetch";
import { getDynamicFetchOptions, type DynamicFetchOptions } from "@/sanity/lib/live";
export { Header } from "./site-header";

function HeaderUnavailable({ navigation }: { navigation: HeaderNavigationModel }) {
  return (
    <header data-header-state="unavailable">
      <p>Site identity is unavailable.</p>
      <HeaderNavigation navigation={navigation} />
    </header>
  );
}

export async function DynamicHeader() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedHeader perspective={perspective} stega={stega} />;
}

export async function CachedHeader({ perspective, stega }: DynamicFetchOptions) {
  const [settings, rawNavigation] = await Promise.all([
    fetchSanitySettings({ perspective, stega }),
    fetchSanityNavigation({ perspective, stega }),
  ]);
  const navigation = createHeaderNavigationModel(rawNavigation);
  const brand = createHeaderBrandModel(settings);
  if (!brand) return <HeaderUnavailable navigation={navigation} />;

  const model = {
    brand,
    navigation,
    contact: settings?.contact,
    alertBar: settings?.alertBar,
    topLinkColumns: (rawNavigation?.topLinkColumns ?? []).map((column) => ({
      key: column._key,
      label: column.label ?? "Quick links",
      links: (column.links ?? []).flatMap((item) => {
        const href = getSafeLinkHref(item.destination?.href);
        return href && item.label ? [{ href, label: item.label, openInNewTab: Boolean(item.destination?.openInNewTab) }] : [];
      }),
    })),
  };

  return <Header model={model} />;
}
