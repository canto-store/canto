"use client";

import Image from "next/image";
import { Check, ArrowRight, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";

function AboutUsPage() {
  // Remove unused translation for now, can be added back when needed

  useEffect(() => {
    // Ensure we start at the top when landing on the about page
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative mb-16 h-[60vh] w-full">
        <div className="absolute inset-0 z-10 bg-black/50" />
        <Image
          src="/placeholder-image.jpg"
          alt="About Canto"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Our Story
          </h1>
          <p className="max-w-3xl text-xl text-white/90 md:text-2xl">
            Connecting customers with authentic handcrafted products since 2022
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold">Our Mission</h2>
            <p className="mb-6 text-gray-600">
              At Canto, we believe in creating a marketplace where artisans and
              craftspeople can showcase their unique talents and connect with
              customers who appreciate handmade quality and craftsmanship.
            </p>
            <p className="mb-8 text-gray-600">
              Our mission is to support local creators while providing customers
              with authentic, high-quality products that tell a story and bring
              joy to their homes.
            </p>
            <div className="space-y-3">
              {[
                "Supporting local artisans and businesses",
                "Promoting sustainable and ethical practices",
                "Creating a community of craft enthusiasts",
                "Offering unique products with character and history",
              ].map((item, i) => (
                <div key={i} className="flex items-start">
                  <Check className="mt-1 mr-2 h-5 w-5 text-emerald-500" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-96 overflow-hidden rounded-lg md:h-[500px]">
            <Image
              src="/placeholder-image.jpg"
              alt="Our mission"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* Values Section */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Authenticity",
                description:
                  "We ensure all products are authentic and handcrafted by verified artisans with passion and dedication.",
              },
              {
                title: "Quality",
                description:
                  "We maintain strict quality standards to guarantee that our customers receive the best handcrafted products.",
              },
              {
                title: "Community",
                description:
                  "We foster a community where creators and customers can connect, share stories, and build relationships.",
              },
            ].map((value, i) => (
              <Card
                key={i}
                className="bg-white p-8 text-center transition-shadow duration-300 hover:shadow-lg"
              >
                <h3 className="mb-4 text-xl font-semibold">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold">Meet Our Team</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "Sarah Johnson",
              role: "Founder & CEO",
              image: "/placeholder-image.jpg",
              bio: "Sarah founded Canto with a passion for connecting artisans with a wider audience.",
            },
            {
              name: "Michael Chen",
              role: "Head of Operations",
              image: "/placeholder-image.jpg",
              bio: "Michael ensures our platform runs smoothly and our artisans receive the support they need.",
            },
            {
              name: "Aisha Patel",
              role: "Creative Director",
              image: "/placeholder-image.jpg",
              bio: "Aisha leads our creative vision and works directly with our artisan community.",
            },
            {
              name: "David Kim",
              role: "Head of Technology",
              image: "/placeholder-image.jpg",
              bio: "David oversees our digital presence and continuously improves our online marketplace.",
            },
          ].map((member, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="relative h-64">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="mb-3 text-sm text-gray-500">{member.role}</p>
                <p className="text-sm text-gray-600">{member.bio}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Our Journey</h2>
          <div className="space-y-12">
            {[
              {
                year: "2022",
                title: "The Beginning",
                description:
                  "Canto was founded with a vision to create a marketplace for authentic handcrafted products.",
              },
              {
                year: "2023",
                title: "Growing Community",
                description:
                  "We expanded our artisan network and launched our mobile application to reach more customers.",
              },
              {
                year: "2024",
                title: "International Expansion",
                description:
                  "We began connecting international artisans with customers across borders, bringing unique crafts to a global audience.",
              },
              {
                year: "2025",
                title: "Innovation & Impact",
                description:
                  "Today, we continue to innovate and create a positive impact in the lives of artisans and customers worldwide.",
              },
            ].map((milestone, i) => (
              <div key={i} className="flex flex-col md:flex-row">
                <div className="md:w-1/4">
                  <div className="mb-2 text-2xl font-bold text-emerald-600 md:mb-0">
                    {milestone.year}
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="mb-2 text-xl font-semibold">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="bg-emerald-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold">Join Our Community</h2>
          <p className="mb-8 text-lg text-gray-600">
            Whether you&apos;re an artisan looking to showcase your work or a
            customer searching for unique handcrafted products, we invite you to
            be part of our growing community.
          </p>
          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Become a Seller
            </Button>
          </div>
          <div className="mt-8 flex justify-center gap-6">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage;
