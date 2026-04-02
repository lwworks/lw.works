import { DigitalDealerPageContent } from '@/components/pages/digital-dealer'
import { Link } from '@/i18n/link'
import { ComponentProps } from 'react'

const content: DigitalDealerPageContent = {
  metadata: {
    title: 'Digital Dealer: Websites for car dealerships — LW Works GmbH',
    description:
      'The modular website package for car dealerships that finally take the digital first impression seriously. Built on modern technology, conversion-optimized – and so flexible that it grows with your business.'
  },
  hero: {
    imageAlt: 'Renault R5 Website Mockup',
    brow: 'Digital Dealer',
    title: 'Your Car Dealership: Online as strong as in the showroom.',
    description:
      'Digital Dealer is the modular website package for car dealerships that finally take the digital first impression seriously. Built on modern technology, conversion-optimized – and so flexible that it grows with your business.',
    cta: {
      href: '#offer',
      label: 'Learn more',
      urgencyNote: 'Only 5 places left'
    }
  },
  testimonial: {
    quote:
      'Finally, our website looks like us. Not after a prefabricated kit, not after 2015. And with this offer, the top website is affordable for all car dealerships.',
    client: {
      name: 'Christian Brunkhorst',
      description: 'CEO, Autohaus Brunkhorst',
      avatar: '/images/digital-dealer/christian-brunkhorst.png'
    },
    logo: {
      srcDark: '/images/digital-dealer/autohaus-brunkhorst-weiss.svg',
      srcLight: '/images/digital-dealer/autohaus-brunkhorst-schwarz.svg',
      alt: 'Autohaus Brunkhorst Logo',
      width: 120,
      height: 32
    }
  },
  problem: {
    brow: 'The Problem',
    title: 'You invest in your showroom, but not in your website.',
    paragraphs: [
      'The first impression of a car dealership is no longer made in the showroom. It is made on the smartphone, at 10 PM, when a potential buyer is looking for their next car.',
      'Studies show: More than 90% of car buyers research online before contacting a dealer. What they find decides – before they even book a test drive. A slow, outdated or unorganized website is not a beauty mistake. It is a seller who rejects customers at the door.',
      'Many dealers rely on decades-old website solutions that are not optimized for mobile devices or current SEO requirements. Google evaluates loading time, structure and user experience today harder than ever – and penalizes bad websites with invisible rankings.',
      'At the same time, the competition pressure is growing through large platforms like mobile.de and AutoScout24. The own website is the only digital channel over which a car dealership has full control: over the first impression, over the conditions, over the brand.'
    ]
  },
  solution: {
    id: 'offer',
    brow: 'Our Solution',
    title: 'The "Digital Dealer" Website Package',
    paragraphs: [
      'Our offer is built exactly for this – as a professional, scalable foundation, that makes (even small) car dealerships competitive and grows long-term.',
      '"Digital Dealer" is not a website kit and not a generic agent solution. It is a modular website system that is specifically developed for car dealerships – technically at the level of 2026, conversion-optimized from the start and built so that it grows automatically after the launch.'
    ]
  },
  callout: {
    title: 'Limited to 5 places',
    paragraphs: [
      'We want to make premium websites affordable for all car dealerships. In order to be able to develop the modular system profitably, on which such websites are based, we need you and four more car dealerships.',
      'For these limited five places, we offer reduced prices before we offer the package at the regular price.'
    ],
    cta: {
      buttons: [
        {
          label: 'Secure your spot now',
          href: '#secure-your-spot'
        }
      ],
      urgencyNote: 'Only 5 places left'
    }
  },
  pricing: {
    id: 'pricing',
    title: 'Digital Dealer: Our Package Prices',
    items: [
      {
        brow: 'Base Package',
        title: 'Digital Dealer – the solid foundation',
        price: {
          original: '8,495 €',
          now: '5,995 €',
          additional: '+ 39 €/month'
        },
        description:
          'No compromises on technology. The website loads fast, ranks on Google, and is built so that any extension can be cleanly integrated – today and in two years.',
        features: [
          'State-of-the-art Next.js architecture with top PageSpeed scores',
          'Technical SEO fully implemented',
          'Modular code – no patchwork, no vendor lock-in'
        ],
        details: {
          collapsedLabel: 'Show details',
          expandedLabel: 'Hide details',
          items: [
            {
              title: 'Technical Highlights',
              description: 'State-of-the-art web architecture: secure, fast, and GDPR-compliant.',
              features: ['Performance optimization', 'Technical search engine optimization', 'Modular structure for easy extension & integration']
            },
            {
              title: 'Design Highlights',
              description: 'No off-the-shelf design. Our designers create the perfect modern look for your dealership.',
              features: ['Modern design system based on your brand', 'Clear focus on UX (user experience)', 'Conversion-optimized page layout']
            },
            {
              title: 'Content',
              description: 'Well-crafted copy and content are the foundation on which good Google rankings are built.',
              features: [
                'Vehicle listings and search functionality',
                'SEO-optimized copy for your brands & models',
                'Company and career pages',
                'Workshop and service offerings'
              ]
            },
            {
              title: 'Integrations',
              description: 'Automatic connections reduce your workload to a minimum.',
              features: [
                'Vehicle listings: CXO or similar vehicle management',
                'Lead management: leads go directly to your inbox or CRM',
                'Google Maps: your customers (and Google) will find you'
              ]
            }
          ]
        }
      },
      {
        brow: 'Add-on Package',
        title: 'Service – Workshop appointments that book themselves',
        price: {
          original: '1,495 €',
          now: '995 €'
        },
        description:
          "Your workshop is often your most profitable area – but most customers don't book spontaneously online. With this package, appointment booking runs around the clock, without anyone having to pick up the phone.",
        features: [
          'Booking flow with vehicle and service selection',
          'Calendar-based appointment selection with real-time availability',
          'Automatic confirmation and reminder to the customer'
        ]
      },
      {
        brow: 'Add-on Package',
        title: 'Convert – Turn visitors into inquiries',
        price: {
          original: '1,495 €',
          now: '995 €'
        },
        description:
          'Getting traffic to the website is half the battle. The other half: turning visitors into concrete leads. This package brings test drive booking, financing calculator, and WhatsApp contact directly to where the customer is deciding – the vehicle listing.',
        features: [
          'Test drive booking with preferred date and real-time availability',
          'Interactive leasing and financing calculator per vehicle listing',
          'WhatsApp integration as a direct conversion booster'
        ]
      },
      {
        brow: 'Add-on Package',
        title: 'Scale – Multi-location and multi-brand',
        price: {
          original: '1,495 €',
          now: '995 €'
        },
        description:
          "Running multiple locations or brands doesn't require triple the website chaos. Scale bundles everything in a clean architecture – with a central vehicle pool, local pages for each branch, and SEO visibility for each location individually.",
        features: [
          'Location-specific pages with team, opening hours, and Google Maps',
          'SEO-optimized subpages for local search queries',
          'Shared vehicle pool across all locations and brands, with location filter'
        ]
      },
      {
        brow: 'Add-on Package',
        title: 'Growth – Your website grows with you',
        price: {
          now: '195 €',
          additional: '/month'
        },
        description:
          'After launch, day-to-day business begins. Growth ensures your website stays permanently up to date: change content via text input, new SEO pages are created automatically when a new model hits the market – no agency briefing, no waiting.',
        features: [
          'Adjust content, copy, and images via natural language input',
          'Automatically create new SEO pages for new models and promotions',
          'Technical monitoring, performance updates, and dedicated contact included'
        ]
      }
    ]
  },
  contact: {
    id: 'secure-your-spot',
    brow: 'Contact',
    title: 'Request your spot now',
    description: 'Secure one of the limited spots. Fill out the form, and we\'ll get back to you within 24 hours.',
    fields: {
      name: {
        label: 'Name',
        placeholder: 'John Smith'
      },
      dealership: {
        label: 'Dealership',
        placeholder: 'Smith Motors'
      },
      email: {
        label: 'Email',
        placeholder: 'john@smith-motors.com'
      },
      phone: {
        label: 'Phone',
        placeholder: '+1 234 567 890'
      }
    },
    plans: {
      label: 'Which packages are you interested in?',
      base: {
        label: 'Base Package – the solid foundation',
        description: 'Always included'
      },
      service: {
        label: 'Package Service',
        description: 'Workshop appointments that book themselves'
      },
      convert: {
        label: 'Package Convert',
        description: 'Turn visitors into concrete leads'
      },
      scale: {
        label: 'Package Scale',
        description: 'Multiple locations & brands'
      },
      growth: {
        label: 'Package Growth',
        description: 'Your website grows with you'
      }
    },
    privacy: <>I have read the <Link href={"/privacy" as ComponentProps<typeof Link>['href']} target="_blank" className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800 dark:hover:text-indigo-500">Privacy Policy</Link> and agree to the processing of my data.</>,
    submit: 'Send request',
    urgencyNote: 'Only 5 places left',
    successMessage: 'Your request has been sent successfully. We will get back to you shortly!'
  }
}

export default content
