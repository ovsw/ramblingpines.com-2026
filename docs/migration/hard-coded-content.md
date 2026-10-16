# Hard-coded content seed

Source: `/work/dev/rbp/old/rbp-web`, commit `fe5ec41e3c6e8b2193c77c3f97f44098fa916023`, captured 2026-10-16. These are public site content sources. The excerpts below preserve the exact text, labels, links, icons and image names for the importer. Comments remain marked as comments and must not become content.

## Home page

Section order: hero, transportation, programs, lunch, location map, testimonials.

- Hero heading: "A Summer Day Camp Like no Other."
- Intro: "Your kids deserve the best. The best supervision, the best activities, the best friends, the best memories."
- Work at Camp: `/staff/current-openings/`.
- Schedule a Tour: `https://calendly.com/ramblingpines/camp-tour`.
- Enroll Now: `https://ramblingpines.campintouch.com/ui/forms/application/camper/App`.
- Transportation: "Door to Door Transportation", "Transportation Areas", "Read More" to `/transportation/`.
- Programs: Pine Cone Camp, Day Camp, Teen Camp, Work at Camp. The fourth card is a job, not the commented Leader in Training card. Exact descriptions, ages, icons and targets are below.
- Lunch: "Lunch Provided", "Lunch Menu" to `/lunch/`, "Request Info" to `/request-info/`.
- Testimonials: "What Parents Say", seven public quotes below. The Kenneth Kim quote ends mid-sentence in the source. Do not invent the rest.

## Header and footer

The active layout imports `header2`, not `header`. Desktop top links are Dates & Rates and Interactive Map on the left; Request Info and Enroll Now on the right. Mobile top links are Dates & Rates and Enroll Now. Mobile main links are Call Us and Email Us.

- Phone: `(609) 466-1212`, `tel:609-466-1212`.
- Email: `info@ramblingpines.com`, `mailto:info@ramblingpines.com`.
- Address: 174 Lambertville Hopewell Rd., Hopewell, NJ 08525, United States.
- Footer heading: Rambling Pines Day Camp. Phone prefix: Call Now.
- Footer policy links: Terms & Conditions `/terms-and-conditions/`, Privacy Policy `/privacy-policy/`, ADA Compliance `/ada-compliance/`, Contact `/request-info/`.
- Footer credit: current year, Rambling Pines Day Camp; Website by OVS Websites, `https://ovswebsites.com`.
- Accreditation image: `src/images/aca-logo.png`, alt "American Camp Association logo".
- Instagram: `https://www.instagram.com/ramblingpines/`.
- Facebook: `https://www.facebook.com/ramblingpinesdaycampnj/`.
- YouTube: `https://www.youtube.com/user/funsummers`.
- Twitter: `https://twitter.com/ramblingpines`.

Menu groups use the exact old title "About us". The new model may normalize it to "About Us" but must normalize page sections with it. The group slugs are menu labels and are not extra sitemap pages. All group columns and links appear in the source excerpt below.

Exclude unused `header/`, `MainQuickLinks`, `MobileQuickLinks`, `MobileMenuExtraItems`, the Corvo Bianco configuration, and all commented Shibley links. The old announcement reads site settings; do not invent announcement text from inactive code.

## Navigation seed

Source: `gatsby-config.js`, `siteMetadata.siteNav`.

```js
siteNav: [
      {
        title: "Future Families",
        slug: "/future-families/",
        children: [
          {
            title: "column 1",
            children: [
              {
                title: "Programs",
                slug: "/programs/",
                children: [
                  {
                    title: "Pine Cone Camp",
                    slug: "/programs/pine-cone-camp/",
                    children: []
                  },
                  {
                    title: "Day Camp",
                    slug: "/programs/day-camp/",
                    children: []
                  },
                  {
                    title: "Teen Camp",
                    slug: "/programs/teen-camp/",
                    children: []
                  }
                  // {
                  //   title: 'Leader in Training',
                  //   slug: '/programs/leader-in-training/',
                  //   children: []
                  // }
                ]
              }
            ]
          },
          {
            title: "column 2",
            children: [
              {
                title: "Activities",
                slug: "/activities/",
                children: [
                  {
                    title: "Clubs & Electives",
                    slug: "/activities/clubs-and-electives/",
                    children: []
                  },
                  {
                    title: "Learn to Swim",
                    slug: "/activities/learn-to-swim/",
                    children: []
                  },
                  {
                    title: "Calendar",
                    slug: "/activities/calendar/",
                    children: []
                  },
                  {
                    title: "Special Events",
                    slug: "/activities/special-events/",
                    children: []
                  }
                ]
              }
            ]
          },
          {
            title: "column 3",
            children: [
              {
                title: "Transportation",
                slug: "/transportation/",
                children: []
              },
              {
                title: "Interactive Map",
                slug: "/interactive-map/",
                children: []
              },
              {
                title: "Lunch",
                slug: "/lunch/",
                children: []
              },
              {
                title: "Beforecare & Aftercare",
                slug: "/beforecare-aftercare/",
                children: []
              },
              {
                title: "FAQs",
                slug: "/faqs/",
                children: []
              }
            ]
          },
          {
            title: "column 4",
            children: [
              {
                title: "Dates & Rates",
                slug: "/dates-and-rates/",
                children: []
              },
              {
                title: "Tuition Assistance",
                slug: "/summer-camp-tuition-assistance/",
                children: []
              },
              {
                title: "Reviews",
                slug: "/reviews/",
                children: []
              }
              // {
              //   title: 'New for 2020',
              //   slug: '/new-for-2020/',
              //   children: []
              // }
            ]
          }
        ]
      },
      {
        title: "About us",
        slug: "/about/",
        children: [
          {
            title: "column 1",
            children: [
              {
                title: "Message from Our Directors",
                slug: "/message-from-our-directors/",
                children: []
              },
              {
                title: "Our Directors",
                slug: "/our-directors/",
                children: []
              },
              {
                title: "Our Staff",
                slug: "/our-staff/",
                children: []
              },
              {
                title: "ACA Accreditation",
                slug: "/aca-accreditation/",
                children: []
              }
            ]
          },
          {
            title: "column 2",
            children: [
              {
                title: "Interactive Map",
                slug: "/interactive-map/",
                children: []
              },
              {
                title: "History",
                slug: "/history/",
                children: []
              },
              {
                title: "Location",
                slug: "/location/",
                children: []
              },
              {
                title: "Directions",
                slug: "/directions/",
                children: []
              }
            ]
          }
        ]
      },
      {
        title: "Current Families",
        slug: "/current-families/",
        children: [
          {
            title: "column 1",
            children: [
              {
                title: "Lunch Menu",
                slug: "/lunch/",
                children: []
              },
              {
                title: "Activity Calendar",
                slug: "/activities/calendar/",
                children: []
              },
              {
                title: "Camp Store",
                slug: "https://www.bunkline.com/category-s/602.htm",
                children: []
              }
            ]
          },
          {
            title: "column 2",
            children: [
              {
                title: "Refer A Family",
                slug: "/refer-a-family/",
                children: []
              },
              {
                title: "Parent Login",
                slug: "https://ramblingpines.campintouch.com/v2/login/login.aspx",
                children: []
              }
            ]
          }
        ]
      },
      {
        title: "Staff",
        slug: "/staff/",
        children: [
          {
            title: "column 1",
            children: [
              {
                title: "Working at Rambling Pines",
                slug: "/staff/working-at-rambling-pines/",
                children: []
              },
              {
                title: "Current Openings",
                slug: "/staff/current-openings/",
                children: []
              },
              {
                title: "Summer Dates",
                slug: "/staff/summer-dates/",
                children: []
              },
              {
                title: "Apply",
                slug: "https://ramblingpines.campintouch.com/ui/forms/application/staff/App",
                children: []
              }
            ]
          }
        ]
      }
    ]
```

## Source: src/pages/index.js

```jsx
import React from 'react'
import {graphql} from 'gatsby'
// import {
//   mapEdgesToNodes,
//   filterOutDocsWithoutSlugs,
//   filterOutDocsPublishedInTheFuture
// } from '../lib/helpers'
// import BlogPostPreviewList from '../components/blog-post-preview-list'
// import Container from '../components/container'
// import Layout from '../containers/layout'

import GraphQLErrorList from '../components/graphql-error-list'
import SEO from '../components/seo'

import Hero from '../components/hp-sections/hero'
import Transportation from '../components/hp-sections/transportation'
import Lunch from '../components/hp-sections/lunch'
import Programs from '../components/hp-sections/programs'
import LocationGmap from '../components/hp-sections/location-gmap'
import Testimonials from '../components/hp-sections/testimonials'

const IndexPage = props => {
  const {data, errors} = props

  if (errors) {
    return (
      <GraphQLErrorList errors={errors} />
    )
  }

  const site = (data || {}).site
  // const postNodes = (data || {}).posts
  //   ? mapEdgesToNodes(data.posts)
  //     .filter(filterOutDocsWithoutSlugs)
  //     .filter(filterOutDocsPublishedInTheFuture)
  //   : []

  if (!site) {
    throw new Error(
      'Missing "Site settings". Open the studio at http://localhost:3333 and add some content to "Site settings" and restart the development server.'
    )
  }

  return (
    <>
      <Hero />
      <Transportation />
      <Programs />
      <Lunch />
      <LocationGmap />
      <Testimonials />

      {/* {postNodes && (
          <BlogPostPreviewList
            title='Latest blog posts'
            nodes={postNodes}
            browseMoreHref='/archive/'
          />
        )} */}
    </>
  )
}

export default IndexPage

export const Head = ({data}) => {
  const site = (data || {}).site
  const ogImage = (data || {}).ogImage

  return (
    <SEO
      title={site && site.title}
      description={site && site.description}
      image={ogImage && ogImage.headerImage}
    />
  )
}

export const query = graphql`
  fragment SanityImage on SanityMainImage {
    crop {
      _key
      _type
      top
      bottom
      left
      right
    }
    hotspot {
      _key
      _type
      x
      y
      height
      width
    }
    asset {
      _id
    }
  }

  query IndexPageQuery {
    site: sanitySiteSettings(_id: { regex: "/(drafts.|)siteSettings/" }) {
      title
      description
      keywords
    }
    ogImage: sanityPage(_id: { regex: "/(drafts.|)workingAtRBP/" }) {
      headerImage {
        ...SanityImageMeta
        alt
      }
    }
    posts: allSanityPost(
      limit: 1
      sort: { publishedAt: DESC }
      filter: { slug: { current: { ne: null } }, publishedAt: { ne: null } }
    ) {
      edges {
        node {
          id
          publishedAt
          mainImage {
            ...SanityImage
            alt
          }
          title
          _rawExcerpt
          slug {
            current
          }
        }
      }
    }
  }
`

```

## Source: src/components/hp-sections/hero.js

```jsx
/** @jsx jsx */
import { useState } from "react";
import { Container, jsx } from "theme-ui";
import { Themed as Styled } from "@theme-ui/mdx";
import { Box } from "@theme-ui/components";
import ModalVideo from "react-modal-video";
import HeroVideoBg from "./hero-video-bg";

import { FaCalendar, FaChevronRight, FaUser } from "react-icons/fa";

import VideoPoster from "../../images/rambling-pines-camp-intro-video.jpg";
import BigLogo from "../../images/rambling-pines-art-logo.png";

import "../../../node_modules/react-modal-video/css/modal-video.min.css";

const Hero = () => {
  const [playFullVideo, setPlayFullVideo] = useState(false);
  return (
    <div>
      <Box
        as="section"
        pt={6}
        pb={6}
        mt={6}
        sx={{
          textAlign: "center",
          borderBottom: "1px solid lightgrey",
          position: "relative",
          zIndex: "1",
          bg: "primaryLight",
          backgroundImage: `url('${VideoPoster}')`,
          backgroundSize: "cover",
          backgroundPosition: "top right"
        }}
        className="Hero"
      >
        <div
          sx={{
            bg: "rgba(0,0,0,.3)",
            display: ["none", "none", "block"],
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 1
          }}
        />
        <div
          sx={{
            display: ["none", "none", "block"],
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 0
          }}
        >
          <HeroVideoBg />
        </div>
        <Container
          className="container"
          sx={{
            maxWidth: "5xl",
            position: "relative",
            zIndex: 10
            // my: [3, 4, 4, 3, 5]
            // bg: 'rgba(0,0,0,.32)'
          }}
        >
          <img src={BigLogo} alt="Rambling Pines Big Logo" />
          <Styled.h1
            sx={{
              textTransform: "lowercase",
              color: "white",
              fontWeight: "normal",
              textShadow: "2px 2px 2px rgba(0,0,0,.5)",
              fontSize: [3, 4],
              fontFamily: "Lato",

              mb: 0
            }}
          >
            A Summer Day Camp Like no Other.
          </Styled.h1>
          <p
            sx={{
              textShadow: "1px 1px 2px rgba(0,0,0,.5)",
              fontSize: [1, 2],
              color: "light",
              fontFamily: "Dosis",
              fontWeight: "light",
              mt: 0
            }}
          >
            Your kids deserve the best. The best supervision, the best activities, the best friends,
            the best memories.{" "}
          </p>

          <div sx="display: 'flex', flexWrap: 'wrap', justifyContent: 'center'">
            {/* <button
              onClick={() => setPlayFullVideo(true)}
              sx={{
                variant: "buttons.3D",
                display: "inline-block",
                py: 3,
                mt: 4,
                mr: 3
              }}
            >
              <FaPlay sx={{ position: "relative", top: "2px" }} /> &nbsp; Watch our Full Video
            </button> */}

            <a
              sx={{ variant: "buttons.3D", display: "inline-block", mr: 3, my: 2 }}
              href="/staff/current-openings/"
              target="_blank"
            >
              <FaUser sx={{ position: "relative", top: "2px" }} /> Work at Camp
            </a>

            <a
              sx={{ variant: "buttons.3DAccent", display: "inline-block", mr: 3, my: 2 }}
              href="https://calendly.com/ramblingpines/camp-tour"
              target="_blank"
            >
              <FaCalendar sx={{ position: "relative", top: "2px" }} /> Schedule a Tour
            </a>
            <a
              sx={{ variant: "buttons.3D", display: "inline-block" }}
              href="https://ramblingpines.campintouch.com/ui/forms/application/camper/App"
              target="_blank"
            >
              <FaChevronRight sx={{ position: "relative", top: "2px" }} /> Enroll Now
            </a>
          </div>
        </Container>
      </Box>
      <ModalVideo
        autoplay="1"
        isOpen={playFullVideo}
        videoId="5rbAeDbueSA"
        onClose={() => setPlayFullVideo(!setPlayFullVideo)}
      />
    </div>
  );
};

export default Hero;

```

## Source: src/components/hp-sections/hero-video-bg.js

```jsx
import React, { useEffect, useRef, useState } from "react";
import { MuxBackgroundVideo } from "@mux/mux-background-video/react";

const MUX_PLAYBACK_ID = process.env.GATSBY_MUX_HP_HERO_PLAYBACK_ID || "";

const HeroVideoBg = () => {
  const muxContainerRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const muxContainerEl = muxContainerRef.current;
    if (!muxContainerEl) {
      return;
    }

    let videoEl = null;
    let observer = null;

    const markVideoReady = () => setIsVideoReady(true);

    const attachVideoListeners = (videoElement) => {
      if (!videoElement) {
        return false;
      }

      videoEl = videoElement;
      videoEl.addEventListener("loadeddata", markVideoReady);
      videoEl.addEventListener("canplay", markVideoReady);
      videoEl.addEventListener("playing", markVideoReady);

      // If metadata is already loaded, avoid an extra hidden frame.
      if (videoEl.readyState >= 2) {
        markVideoReady();
      }

      return true;
    };

    if (!attachVideoListeners(muxContainerEl.querySelector("video"))) {
      observer = new MutationObserver(() => {
        if (attachVideoListeners(muxContainerEl.querySelector("video"))) {
          observer.disconnect();
        }
      });

      observer.observe(muxContainerEl, { childList: true, subtree: true });
    }

    return () => {
      if (videoEl) {
        videoEl.removeEventListener("loadeddata", markVideoReady);
        videoEl.removeEventListener("canplay", markVideoReady);
        videoEl.removeEventListener("playing", markVideoReady);
      }

      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  if (!MUX_PLAYBACK_ID) {
    return null;
  }

  const src = `https://stream.mux.com/${MUX_PLAYBACK_ID}.m3u8`;
  const posterUrl = `https://image.mux.com/${MUX_PLAYBACK_ID}/thumbnail.webp?time=0`;

  return (
    <div
      className="hero-mux-video-bg"
      ref={muxContainerRef}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
    >
      <img
        src={posterUrl}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: isVideoReady ? 0 : 1,
          transition: "opacity 180ms ease",
          pointerEvents: "none"
        }}
      />
      <MuxBackgroundVideo
        src={src}
        maxResolution="1080p"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: isVideoReady ? 1 : 0,
          transition: "opacity 180ms ease"
        }}
      />
      <style>{`
        .hero-mux-video-bg mux-background-video,
        .hero-mux-video-bg mux-background-video video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default HeroVideoBg;

```

## Source: src/components/hp-sections/transportation.js

```jsx
/** @jsx jsx */
import React from 'react' // eslint-disable-line
import {jsx, Container} from 'theme-ui'
import {Themed as Styled} from '@theme-ui/mdx'
import {Flex, Box} from '@theme-ui/components'

import {Link, useStaticQuery, graphql} from 'gatsby'
import {GatsbyImage, getImage} from 'gatsby-plugin-image'

import {FaBus} from 'react-icons/fa'

// containers
import SectionWithSidebar from '../section-with-sidebar'

const TransportationSection = () => {
  return (
    <section sx={{variant: 'sections.hpSectionLight'}}>
      <SectionWithSidebar mainContent={<MainContent />} sidebar={<Sidebar />} />
      <Container sx={{maxWidth: '6xl', pt: [4, 4, 0]}}>
        <Styled.h1 as='h3' sx={{fontWeight: 'normal', mb: 4}}>Transportation Areas</Styled.h1>
        <Flex sx={{
          flexWrap: 'wrap',
          'div': {
            pr: 4,
            mb: [4, 4, 0],
            width: ['full', '1/3', '1/5'],
            'ul': {
              variant: 'lists.reset',
              color: 'gray.3',
              mt: 3,
              ml: '0',
              borderLeft: '2px solid',
              borderColor: 'accent',
              pl: '10px'
            },
            'li': {
              ml: 2,
              mb: 2,
              'span': {
                color: 'text',
                lineHeight: '0.3'
              }
            },
            'h4': {
              fontWeight: 'normal'
            }
          }
        }}>

          <Box>
            <Styled.h4>Mercer County:</Styled.h4>
            <ul>
              <li><span>Ewing</span></li>
              <li><span>Hamilton</span></li>
              <li><span>Hopewell</span></li>
              <li><span>Lawrenceville</span></li>
              <li><span>Pennington</span></li>
              <li><span>Princeton</span></li>
              <li><span>Robbinsville</span></li>
              <li><span>Titusville</span></li>
              <li><span>West Windsor</span></li>
            </ul>
          </Box>

          <Box>
            <Styled.h4>Somerset County:</Styled.h4>
            <ul>
              <li><span>Belle Mead</span></li>
              <li><span>Branchburg</span></li>
              <li><span>Hillsborough</span></li>
              <li><span>Neshanic</span></li>
              <li><span>Rocky Hill</span></li>
              <li><span>Skillman</span></li>
            </ul>

          </Box>

          <Box>
            <Styled.h4>Hunterdon County: </Styled.h4>
            <ul>
              <li><span>East Amwell</span></li>
              <li><span>Flemington</span></li>
              <li><span>Lambertville</span></li>
              <li><span>Readington</span></li>
              <li><span>Sergeantsville</span></li>
              <li><span>Stockton</span></li>
              <li><span>West Amwell</span></li>
            </ul>
          </Box>

          <Box>
            <Styled.h4>Bucks County: </Styled.h4>
            <ul>
              <li><span>New Hope</span></li>
              <li><span>Newtown</span></li>
              <li><span>Washington Crossing</span></li>
              <li><span>Yardley</span></li>
            </ul>
          </Box>

          <Box>
            <Styled.h4>Middlesex County:</Styled.h4>
            <ul>
              <li><span>Kendall Park</span></li>
              <li><span>Plainsboro</span></li>
              <li><span>South Brunswick</span></li>
            </ul>
          </Box>
        </Flex>
      </Container>
    </section>
  )
}

const MainContent = () => {
  const {transportationImage} = useStaticQuery(
    graphql`
    query {
      transportationImage: file(relativePath: { eq: "transportation-illustration.png" }) {
        childImageSharp {
          gatsbyImageData(width: 726, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
        }
      }
    }
    `
  )
  const image = getImage(transportationImage.childImageSharp)

  return (
    <>
      <GatsbyImage image={image} alt='Transportation illustration' sx={{maxWidth: '650px', ml: [0, 0, 4]}} />
    </>
  )
}

const Sidebar = () => {
  return (
    <div sx={{p: {lineHeight: 'snug'}}}>
      <Styled.h1 as='h2'>Door to Door Transportation</Styled.h1>
      <p>Parents wish for a quality summer day camp near them. With door to door busing, it is.</p>
      <p>Transportation is provided using air-conditioned, 24 passenger mini-buses.</p>
      <p>All buses are professionally driven and have seatbelts. There is a bus aid on each bus. Transportation is included in the camp tuition.</p>
      <Link to='/transportation/' sx={{variant: 'buttons.3D', display: 'inline-block', my: 3, mr: 3, position: 'relative', pl: '3.5rem'}}>
        <FaBus sx={{position: 'absolute', top: '0.7rem', left: '1rem', fontSize: 4}} /> Read More
      </Link>
      {/* <a href='tel:6094661212' sx={{variant: 'buttons.3DAccent', display: 'inline-block'}}><FaPhone /> Call Us: (609) 466-1212</a> */}
    </div>
  )
}

export default TransportationSection

```

## Source: src/components/hp-sections/programs/index.js

```jsx
/** @jsx jsx */
import React from 'react' // eslint-disable-line
import {jsx} from 'theme-ui'
import {Themed as Styled} from '@theme-ui/mdx'
import {Link} from 'gatsby'
import {Box, Flex} from '@theme-ui/components'

import {FaPaperPlane} from 'react-icons/fa'

// containers
import SectionWithSidebar from '../../section-with-sidebar'
// commponents
import ProgramItem from './program'

// images
import SectionBg from '../../../images/yellow-paper-bg.jpg'

const Programs = () => {
  return (
    <section sx={{
      variant: 'sections.hpSection',
      background: `url(${SectionBg}) repeat center center`
    }}>
      <SectionWithSidebar sidebar={<Sidebar />} mainContent={<MainContent />} />
    </section>
  )
}

const Sidebar = () => {
  return (
    <>
      <Styled.h1 as='h2'>Programs</Styled.h1>
      <p> Each program provides structured activities chosen for your child's age group, along with well-trained and caring counselors and all the fun and excitement your child needs for the perfect summer. </p>
      <p> To make the summer a little easier for parents, we offer these special benefits for busy families: </p>
      <ul>
        <li>Complimentary door-to-door bus service</li>
        <li>Flexible camp schedules for busy families</li>
        <li>Modified program available to preschoolers</li>
      </ul>
      <div sx={{textAlign: 'center', mt: 4}}>
        <Link to='/request-info/' sx={{variant: 'buttons.3DAccent', display: 'inline-block'}}><FaPaperPlane /> Request Info</Link>
      </div>
    </>
  )
}

const programs = [
  {
    name: "Pine Cone Camp",
    icon: "pineCone",
    description:
      "Even the youngest children from grades Pre-K through 1st Grade can enjoy a great camp experience at Rambling Pines!",
    link: "/programs/pine-cone-camp/"
  },
  {
    name: "Day Camp",
    icon: "dayCamp",
    description:
      "Children grades 2nd to 8th get a truly memorable camp experience with the varied programs Rambling Pines has to offer.",
    link: "/programs/day-camp/"
  },
  {
    name: "Teen Camp",
    icon: "teenagers",
    description:
      "It’s not easy being a young teenager—too old for day camp, not quite old enough for a summer job. For campers in 7th through 9th Grade, the Teen Camp is the way to go!",
    link: "/programs/teen-camp/"
  },
  {
    name: "Work at Camp",
    icon: "leader",
    description:
      "Not a program but a job. Young adults entering 10th, 11th, or 12th Grade can enjoy working at camp. There's no better way to spend summer than making a difference for children.",
    link: "/staff/working-at-rambling-pines/"
  }
  // {
  //   name: 'Leader in Training',
  //   icon: 'leader',
  //   description: 'This program is specially designed for our 10th Grade campers to enjoy a summer of play and work as they transition from being our oldest campers to becoming our newest staff members.',
  //   link: '/programs/leader-in-training/'
  // }
];

const MainContent = () => {
  return (
    <Flex sx={{pl: [0, 0, 4], flexWrap: 'wrap'}}>
      {programs.map(program => (
        <Box key={program.name} sx={{width: ['full', 'full', '1/2'], display: 'flex'}}>
          <ProgramItem {...program} />
        </Box>
      ))}
    </Flex>
  )
}

export default Programs

```

## Source: src/components/hp-sections/programs/program.js

```jsx
/** @jsx jsx */
import React from 'react' // eslint-disable-line
import {jsx} from 'theme-ui'
import {Themed as Styled} from '@theme-ui/mdx'
import {Link} from 'gatsby'

import Icon from '../../icon'

import WhitePaper from '../../../images/white-paper-bg2.jpg'

const ProgramItem = ({name, icon = 'pineCone', iconSize = '3rem', description, link}) => {
  return (
    <Link to={link} sx={{variant: 'links.programListLink',
      transition: 'transform 0.1s ease-out',
      boxShadow: '0 0 12px -2px rgba(0,0,0,0.1)',
      background: `url(${WhitePaper})`,
      borderRadius: '7px',
      '&:hover': {
        boxShadow: '0 0 12px -2px rgba(0,0,0,0.2)',
        transform: 'scale(1.1)',
        '.iconBg': {
          bg: 'accent',
          color: 'primary',
          'svg': {
            transform: 'scale(1.9)'
          }
        }
      }}}>

      <div sx={{
        fontSize: iconSize,
        color: 'white',
        borderRadius: '1000px'
      }}>
        <div className='iconBg' sx={{
          borderRadius: '1000px',
          width: '6rem',
          height: '6rem',
          bg: 'primary',
          border: '1px dashed red',
          borderColor: 'white',
          p: '1.5rem',
          mx: 'auto',
          transition: 'all 0.1s ease-out'
        }}>
          <Icon symbol={icon} />
        </div>
      </div>
      <Styled.h3 sx={{mt: 2}}>{name}</Styled.h3>
      <p sx={{fontSize: 1, lineHeight: '1.5'}}>{description}</p>
    </Link>
  )
}

export default ProgramItem

```

## Source: src/components/hp-sections/lunch.js

```jsx
/** @jsx jsx */
import React from 'react' // eslint-disable-line
import {jsx} from 'theme-ui'
import {Themed as Styled} from '@theme-ui/mdx'
import {Link, useStaticQuery, graphql} from 'gatsby'
import {GatsbyImage, getImage} from 'gatsby-plugin-image'

import {FaHamburger, FaPaperPlane} from 'react-icons/fa'

// containers
import SectionWithSidebar from '../section-with-sidebar'

const FoodSection = () => {
  return (
    <section sx={{variant: 'sections.hpSectionLightNoBottom'}}>
      <SectionWithSidebar leftSidebar mainContent={<MainContent />} sidebar={<Sidebar />} />
    </section>
  )
}

const MainContent = () => {
  const {foodImage} = useStaticQuery(
    graphql`
    query {
      foodImage: file(relativePath: { eq: "lunch-time-illustration.png" }) {
        childImageSharp {
          gatsbyImageData(width: 726, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
        }
      }
    }
    `
  )
  const image = getImage(foodImage.childImageSharp)

  return (
    <div sx={{
      mx: [0, 5, 4, 5, 6]
    }}>
      <GatsbyImage image={image} alt='Lunch time illustration' />
    </div>
  )
}

const Sidebar = () => {
  return (
    <div sx={{p: {lineHeight: 'snug'}}}>
      <Styled.h1 as='h2'>Lunch Provided</Styled.h1>
      <p>To make your life a little bit easier, a nutritious and delicious lunch is provided daily. </p>
      <p>A vegetarian option is always available. Little ones get a morning snack and everyone enjoys an afternoon snack of ice cream or ice pops.</p>
      <Link to='/lunch/' sx={{variant: 'buttons.3D', display: 'inline-block', my: 3, mr: 3, position: 'relative', pl: '3.5rem'}}>
        <FaHamburger sx={{position: 'absolute', top: '0.7rem', left: '1rem', fontSize: 4}} /> Lunch Menu
      </Link>
      <Link to='/request-info/' sx={{variant: 'buttons.3DAccent', display: 'inline-block'}}><FaPaperPlane /> Request Info</Link>
    </div>
  )
}

export default FoodSection

```

## Source: src/components/hp-sections/location-gmap.js

```jsx
import React from 'react'

const LocationGmap = () => {
  return (
    // <iframe src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.10582281858!2d-74.81401938460505!3d40.38434717936888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3e52bbdfd9ce7%3A0xe31c708be75c4a05!2sRambling+Pines+Day+Camp!5e0!3m2!1sen!2snp!4v1556893788448!5m2!1sen!2snp' width='100%' height='550' frameBorder='0' style={{border: '0', display: 'block'}} allowFullScreen />
    <iframe title='Rambling Pines location map' src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2629.6722610352667!2d-74.81360121506592!3d40.38622970060386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xe31c708be75c4a05!2sRambling%20Pines%20Day%20Camp!5e1!3m2!1sen!2snp!4v1573723658901!5m2!1sen!2snp' width='100%' height='550' frameBorder='0' style={{border: '0', display: 'block'}} allowFullScreen />
  )
}

export default LocationGmap

```

## Source: src/components/hp-sections/testimonials/index.js

```jsx
/** @jsx jsx */
import {jsx, Container} from 'theme-ui'
import {Themed as Styled} from '@theme-ui/mdx'
import Slider from 'react-slick'

import TestimonialItem from './testimonial-item'

// styles
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// images
import SectionBg from '../../../images/img-bg-2.png'

function NextArrow (props) {
  const {className, onClick} = props
  return (
    <button
      type='button'
      aria-label='Next testimonials'
      className={className}
      // style={{...style}}
      onClick={onClick}
      sx={{
        left: '-2rem',
        '&::before': {
          color: 'primary',
          fontSize: '2rem'
        }
      }}
    />
  )
}

function PrevArrow (props) {
  const {className, onClick} = props
  return (
    <button
      type='button'
      aria-label='Previous testimonials'
      // style={{...style}}
      className={className}
      sx={{
        right: '-1rem',
        '&::before': {
          fontSize: '2rem',
          color: 'primary'
        }
      }}
      onClick={onClick}
    />
  )
}

const TestimonialsSection = () => {
  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    centerMode: false,
    dots: true,
    arrows: true,
    swipeToSlide: true,
    prevArrow: <NextArrow />,
    nextArrow: <PrevArrow />,
    // fade: true,
    // adaptiveHeight: true
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
          // initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ],
    appendDots: dots => (
      <div>
        <ul style={{
          position: 'relative', top: '50px', padding: '0'}}> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div
        sx={{
          width: '1.5rem',
          height: '1.5rem',
          fontSize: '1rem',
          lineHeight: '1.5rem',
          bg: 'primary',
          color: 'light',
          borderRadius: '100%',
          '.slick-active & ': {
            bg: 'accent',
            color: 'primaryDark',
            boxShadow: '0 0 6px #008080'
          }
        }}
      >
        {i + 1}
      </div>
    )
  }
  return (
    <section sx={{
      variant: 'sections.hpSection',
      py: [5, 5, 5, 6],
      pb: [6, 5, 5, 6],
      background: `url(${SectionBg}) no-repeat bottom left`,
      backgroundSize: 'cover',
      marginBottom: '-3rem',
      position: 'relative',
      zIndex: '2'
    }}>
      <Styled.h1 as='h2' sx={{textAlign: 'center'}}>What Parents Say</Styled.h1>
      <Container sx={{maxWidth: '6xl', px: ['2.8rem', 5, 0]}}>
        <Slider {...settings}>
          {testimonialsContentTemp.map(testimonial => <TestimonialItem {...testimonial} key={testimonial.name} />)}
        </Slider>
      </Container>
    </section>
  )
}

const testimonialsContentTemp = [
  {
    name: 'Alex Reznik',
    text: 'This is a Great Camp!! Our children have been going to Rambling Pines since they were in Kindergarten and our oldest is now a counselor. The Camp has wonderful owners and very friendly and helpful staff. Everyone is very attentive to the children. Driving into the camp, you see the children participating in so many various activities. There is something amazing about growing up with summers at Ramblings Pines, making great friends, and then working at the camp. Our boys have so many memories at Rambling Pines and they look forward to going back every Summer.'
  },
  {
    name: 'Kenneth Kim',
    text: 'This is a Great Camp!! Our children have been going to Rambling Pines since they were in Kindergarten and our oldest is now a counselor. The Camp has wonderful owners and very friendly and helpful staff. Everyone is very attentive to the'
  },
  {
    name: 'David Shapiro',
    text: 'My daughter went to multiple camps in the Princeton/Pennington, area, and year after year enjoyed them, but was never fully satisfied. Then she went to Rambling Pines. The environment they provided for her was incredible! She loved it. It was the only camp she actually asked us to extended her time there for the following season. The Jordan family are committed to providing their campers a really fun and engaging time, with a lot of activities, in a very well maintained camp setting. 5 Star Ratings. I highly recommend. Thanks.'
  },
  {
    name: 'Ellana Sulla',
    text: 'My Daughter started going to this camp 3 years ago. She was 6 years old was very hesitant because she didn’t know anyone.  The staff starting from the bus driver at pick up to the bus  counselor and camp counselor where amazing.   She camp home her first day and loved it.  Everyone there is warm accommodating and friendly.  You can see and feel they all love what they do. All the way up  to the owners.   What else can a parent want.'
  },
  {
    name: 'Amy O\'Donnell',
    text: 'My first grade daughter will be spending her 4th summer at Rambling Pines, and we couldn\'t be happier!  There are so many reasons that we love his camp: the bus service that picks her up at our door,  the awesome facilities (including 2 pools, mini golf, large indoor gym, arts room, horses etc.),  the very high staff to child ratio, the kind and creative staff, the yummy kid-oriented lunches and snacks, and so much more.  My daughter comes back every day with a smile on her face, ready to tell me all her adventures, and in my opinion that is what summer should be!'
  },
  {
    name: 'Suzan Milman',
    text: 'I find Rambling Pines to be a very nurturing and supportive environment for our children. I have always felt that my children are in safe and loving hands when they are at this camp. My three kids always come off the bus with a smile on their faces and some exciting story to share.  Even my most introverted child can’t wait to get back the very next day!'
  },
  {
    name: 'Nicole Klein',
    text: 'I\'m in my 30\'s and remember my own fun summers at Rambling Pines. Both my children go there (3 & 7) and they absolutely love it.  They come home with huge smiles on their faces [...] The bus service is a huge bonus for me as the pick and and drop off door to door.  This camp is family run and a has great professional staff that keep parents aware of what is going on. I never had anything but good experiences with the enthusiastic councelors. I know my kids are safe there and the nurse is very attentive.'
  }
]

export default TestimonialsSection

```

## Source: src/components/header2/TopHeader/Column1.js

```jsx
/** @jsx jsx */
import React from 'react' // eslint-disable-line
import {jsx} from 'theme-ui'
// import {jsx, Container, Styled} from 'theme-ui'
import {Link} from 'gatsby'
// import {useBreakpointIndex} from '@theme-ui/match-media'

const Column1 = () => {
  // const responsiveIndex = useBreakpointIndex()

  return (
    <div className='contact-col'>

      {/* MOBILE ONLY */}
      <div className='mobile-menu' sx={{display: ['block', null, null, 'none'], a: {fontSize: ['0.8rem', 1], lineHeight: 2}}}>
        <ul sx={{variant: 'lists.reset', display: 'flex', justifyContent: 'space-between', li: {display: 'inline-block'}}}>
          <li>
            <Link to='/dates-and-rates/' title='Dates &amp; Rates'><span>Dates &amp; Rates</span></Link>
          </li>
          <li>
            <a href='https://ramblingpines.campintouch.com/ui/forms/application/camper/App' title='Enroll Now' rel='noopener noreferrer' target='_blank'><span> Enroll Now</span></a>
          </li>
        </ul>
      </div>
      {/* END MOBILE ONLY */}

      {/* DESKTOP ONLY */}
      <div sx={{display: ['none', null, null, 'block']}}>
        <ul sx={{variant: 'lists.reset', li: {display: 'inline-block'}}}>
          <li>
            <Link to='/dates-and-rates/' sx={{variant: 'links.topBar'}}>Dates &amp; Rates</Link>
          </li>
          <li>
            <Link to='/interactive-map/' sx={{variant: 'links.topBar'}}>Interactive Map</Link>
          </li>

        </ul>
      </div>
      {/*  DESKTOP ONLY */}

      {/* <div className='enroll-link'>
        <span className='svg-ic'><svg xmlns='http://www.w3.org/2000/svg' id='Layer_1' data-name='Layer 1' viewBox='0 0 18.57 18.59'><title>SDC_Icons_Final_JV</title><polygon points='13.88 17.69 0.9 17.69 0.9 4.7 6.17 4.7 6.17 3.8 0 3.8 0 18.59 14.78 18.59 14.78 11.6 13.88 11.6 13.88 17.69' /><path d='M4.2,14.41,9,13.63l9.52-9.55L14.48,0,5,9.56ZM14.48,1.27,17.3,4.08l-1.59,1.6L12.89,2.86ZM5.8,10,12.26,3.5l2.81,2.81L8.62,12.79l-3.34.53Z' /></svg></span>
        <a href='https://shibley.campintouch.com/ui/forms/application/camper/App' title='Enroll Now'>Enroll Now</a>
      </div> */}
    </div>
  )
}

export default Column1

```

## Source: src/components/header2/TopHeader/Column2.js

```jsx
/** @jsx jsx */
import React from 'react' // eslint-disable-line
import {jsx} from 'theme-ui'
// import {jsx, Container, Styled} from 'theme-ui'
import {Link} from 'gatsby'

const Column2 = () => {
  return (
    <ul className='top-right' sx={{variant: 'lists.reset', li: {display: 'inline-block'}}}>
      <li>
        <Link to='/request-info/' sx={{variant: 'links.topBar'}} rel='noopener noreferrer' target='_blank'>Request Info</Link>
      </li>
      <li>
        <a href='https://ramblingpines.campintouch.com/ui/forms/application/camper/App' rel='noopener noreferrer' sx={{variant: 'links.topBar'}}target='_blank'>Enroll Now</a>
      </li>
    </ul>
  )
}

export default Column2

```

## Source: src/components/header2/announcement.js

```jsx
/** @jsx jsx */
import React, { useContext } from 'react' // eslint-disable-line
import {Container, jsx} from 'theme-ui'
// import {Box, Flex} from '@theme-ui/components'
import PortableText from '../portableText'

import {FaTimes} from 'react-icons/fa'

const Announcement = ({closeAlert, alertText}) => {
  return (
    <div sx={{position: 'relative', bg: 'primary', color: 'light', textAlign: 'center', 'a': {color: 'accent'}}}>
      <Container sx={{
        maxWidth: '4xl',
        mx: 'auto',
        p: 0,
        px: [2, 3],
        pb: 1,
        whiteSpace: ['normal', 'normal', 'nowrap'],
        overflow: 'hidden',
        '@keyframes marquee': {
          '0%': {
            transform: 'translate(0,0)'
          },
          '100%': {
            transform: 'translate(-100%,0)'
          }
        },
        '&:hover p': {
          animationPlayState: 'paused'
        }
      }}>
        <div sx={alertTextStyles}>
          {alertText && <PortableText blocks={alertText} />}
        </div>
      </Container>
      <button onClick={closeAlert} sx={{position: 'absolute', px: '2', right: '0', top: '50%', transform: 'translateY(-50%)', zIndex: '10', bg: 'transparent', border: 'none', color: 'light', cursor: 'pointer'}}><FaTimes sx={{fontSize: '1rem'}} /><span sx={{display: ['none', 'none', 'inline'], position: 'relative', bottom: '3px'}}>close</span></button>
    </div>
  )
}

export default Announcement

const alertTextStyles = {
  p: {
    margin: 0,
    fontSize: [1, 1, 2],
    display: 'inline-block',
    pl: ['0', '0', '100%'],
    // keep marquee text clear of the absolute-positioned close button
    pr: ['4.5rem', '4.5rem', '4.5rem'],
    animation: ['none', 'none', 'marquee 15s linear infinite'],
    strong: {
      fontSize: [0, 0, 1]
    }
  }
}

```

## Source: src/components/header2/BottomHeader/Nav/Mobile/MobileMainLinks.js

```jsx
/** @jsx jsx */
import React from 'react' // eslint-disable-line
import {jsx} from 'theme-ui'
// import {jsx, Container, Styled} from 'theme-ui'
// import {Link} from 'gatsby'

// icons
import {FiPhoneCall, FiMail} from 'react-icons/fi'

const MobileMainReplacement = props => {
  return (
    // <div className='mobile-info' >
    <ul {...props} sx={{
      variant: 'lists.reset',
      'li, a': {
        display: 'flex'
      },
      'a': {
        px: 3,
        textDecoration: 'none',
        color: 'primary'
      },
      span: {
        margin: 'auto',
        '@media (max-width: 575px)': {
          fontSize: '0px'
        }
      },
      svg: {
        fontSize: '2',
        position: 'relative',
        top: '.1rem'
      }
    }}>
      <li sx={{borderRight: '1px solid', borderColor: 'muted'}}>
        <a href='tel:609-466-1212' title='Call Us'>
          <span><FiPhoneCall /> Call Us</span>
        </a>
      </li>
      <li sx={{
        '@media screen and (max-width: 350px )': {
          display: 'none!important'
        }
      }}>
        <a href='mailto:info@ramblingpines.com' title='Email Us'>
          <span> <FiMail /> Email Us</span>
        </a>
      </li>
    </ul>
    // </div>
  )
}

export default MobileMainReplacement

```

## Source: src/components/footer.js

```jsx
/** @jsx jsx */
import React from 'react' // eslint-disable-line
import {jsx, Container} from 'theme-ui'
import {Themed as Styled} from '@theme-ui/mdx'
import {Box, Flex} from '@theme-ui/components'
import {Link} from 'gatsby'

// components
import SocialLinks from './socialLinks'

// images
import AcaLogoImg from '../images/aca-logo.png'
import FooterBg from '../images/footer-bg-2.jpg'

const Footer = () => {
  return (
    <footer sx={{display: 'block', background: `url(${FooterBg}) repeat-x center center`, color: 'textMuted'}}>
      <Container>
        <Flex sx={{flexWrap: 'wrap', pt: [4, 4, 5, 6], pb: [2, 3, null, null, 4]}}>
          <Box sx={{width: ['full', '1/2'], px: [0, 4], py: [4, 0], textAlign: ['center', 'right'], borderRight: ['none', '1px solid lightgray']}}>
            <div className='vcard'>
              <div className='org'><Styled.h3 as='h3' sx={{mt: 0, color: 'light'}}>Rambling Pines Day Camp</Styled.h3></div>
              <div className='tel'>
                Call Now <a sx={{variant: 'links.footerLinks'}} href='tel:609-466-1212'>(609) 466-1212</a>
              </div>
              <a className='email' sx={{variant: 'links.footerLinks'}} href='mailto:info@ramblingpines.com'>info@ramblingpines.com</a>
              <div className='adr' sx={{mt: 4}}>
                <div className='street-address'>174 Lambertville Hopewell Rd.</div>
                <span className='locality'>Hopewell</span>,{' '}
                <span className='region'>NJ</span>{' '}
                <span className='postal-code'>08525</span>{' '}
                <span className='country-name'>United States</span>
              </div>

            </div>
          </Box>
          <Box sx={{width: ['full', '1/2'], px: 4, textAlign: 'center'}}>
            <SocialLinks />
            <img src={AcaLogoImg} sx={{maxWidth: 'full', width: '48'}} alt='American Camp Association logo' />
          </Box>
        </Flex>
        <p sx={{
          textAlign: 'center',
          color: 'gray.5',
          a: {
            color: 'gray.4'
          }
        }}>
          <Link to='/terms-and-conditions/'>Terms &amp; Conditions</Link> |{' '}
          <Link to='/privacy-policy/'>Privacy Policy</Link> |{' '}
          <Link to='/ada-compliance/'>ADA Compliance</Link> |{' '}
          <Link to='/request-info/'>Contact</Link>
        </p>
      </Container>
      <div sx={{textAlign: 'center', p: 3, fontSize: 1, color: 'muted', bg: 'rgba(0,0,0,0.5)'}}>
        &copy; {new Date().getFullYear()}, Rambling Pines Day Camp
        |
        Website by <a href='https://ovswebsites.com' sx={{color: '#f36'}}>OVS Websites</a>
      </div>
    </footer>
  )
}

export default Footer

```

## Source: src/components/socialLinks.js

```jsx
/** @jsx jsx */
import React from 'react' // eslint-disable-line
import {jsx} from 'theme-ui'

import {FaFacebookSquare, FaYoutubeSquare, FaTwitterSquare, FaInstagram} from 'react-icons/fa'

const SocialLinks = () => {
  return (
    <ul sx={{
      variant: 'lists.reset',
      mb: 3,
      li: {
        display: 'inline-block',
        mr: 2
      },
      a: {
        display: 'inline-block',
        fontSize: 5,
        bg: 'white',
        borderRadius: '5px',
        p: '0',
        svg: {
          margin: '0',
          padding: '0'
        }
      }
    }}>
      <li><a href='https://www.instagram.com/ramblingpines/' sx={{color: '#8134AF'}} rel='noopener noreferrer'><FaInstagram /></a></li>
      <li><a href='https://www.facebook.com/ramblingpinesdaycampnj/' sx={{color: '#3b5998'}} rel='noopener noreferrer'><FaFacebookSquare /></a></li>
      <li><a href='https://www.youtube.com/user/funsummers' sx={{color: '#ff0000'}} rel='noopener noreferrer'><FaYoutubeSquare /></a></li>
      <li><a href='https://twitter.com/ramblingpines' sx={{color: '#00acee'}} rel='noopener noreferrer'><FaTwitterSquare /></a></li>
    </ul>
  )
}

export default SocialLinks

```
