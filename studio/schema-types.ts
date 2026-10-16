import mapMarker from "./schemas/documents/map-marker";
// documents
import page from "./schemas/documents/page";
import faq from "./schemas/documents/faq";
import testimonial from "./schemas/documents/testimonial";
import navigation, {
  navigationSchemaTypes,
} from "./schemas/documents/navigation";
import settings, { settingsSchemaTypes } from "./schemas/documents/settings";
import teamMember from "./schemas/documents/team-member";
import homePage from "./schemas/documents/home-page";
import footer, { footerSchemaTypes } from "./schemas/documents/footer";
import redirect from "./schemas/documents/redirect";

// Schema UI shared objects
import blockContent from "./schemas/blocks/shared/block-content";
import link from "./schemas/blocks/shared/link";
import { colorVariant } from "./schemas/blocks/shared/color-variant";
import sectionPadding from "./schemas/blocks/shared/section-padding";
import customUrl from "./schemas/blocks/shared/custom-url";
import customLink from "./schemas/blocks/shared/custom-link";
import button from "./schemas/blocks/shared/button";
import buttonLink from "./schemas/blocks/shared/button-link";
import richTextContent from "./schemas/blocks/shared/rich-text-content";
import simpleRichText from "./schemas/blocks/shared/simple-rich-text";
// Schema UI objects
import richTextBlock from "./schemas/blocks/rich-text-block";
import scaffold from "./schemas/blocks/scaffold";
import hubspotForm from "./schemas/blocks/hubspot-form";
import reviews from "./schemas/blocks/reviews";
import video from "./schemas/blocks/video";
import locationMap from "./schemas/blocks/location-map";
import muxVideoHero from "./schemas/blocks/mux-video-hero";
import transportation from "./schemas/blocks/transportation";
import programs from "./schemas/blocks/programs";
import lunch from "./schemas/blocks/lunch";
import testimonials from "./schemas/blocks/testimonials";
import interactiveMap from "./schemas/blocks/interactive-map";
// page-builder-generator:block-imports

export const schemaTypes = [
  // documents
  page,
  mapMarker,
  faq,
  testimonial,
  navigation,
  ...navigationSchemaTypes,
  settings,
  ...settingsSchemaTypes,
  teamMember,
  homePage,
  footer,
  redirect,
  ...footerSchemaTypes,
  // shared objects
  blockContent,
  link,
  colorVariant,
  sectionPadding,
  customUrl,
  customLink,
  button,
  buttonLink,
  richTextContent,
  simpleRichText,
  // blocks
  richTextBlock,
  scaffold,
  hubspotForm,
  reviews,
  video,
  locationMap,
  muxVideoHero,
  transportation,
  programs,
  lunch,
  testimonials,
  interactiveMap,
  // page-builder-generator:block-types
];
