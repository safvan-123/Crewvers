import type {Metadata} from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import AnimationController from "../components/AnimationController";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {getWebsite} from "../lib/cms";
import {siteUrl} from "../lib/seo";
export const metadata: Metadata = {
 ...(siteUrl ? {metadataBase:new URL(siteUrl)} : {}),
 title:{default:"CrewVerse Kerala | Event Staff, Entertainment & Film Crews",template:"%s | CrewVerse"},
 description:"Event staff, performers and film production crews for events and businesses in Kerala. Discuss your requirements with CrewVerse.",
 icons:{
  icon:[
   {url:"/favicon.ico",sizes:"16x16 32x32 48x48 64x64 96x96 128x128 256x256",type:"image/x-icon"},
   {url:"/favicon-32x32.png",sizes:"32x32",type:"image/png"},
   {url:"/favicon-48x48.png",sizes:"48x48",type:"image/png"},
   {url:"/favicon-96x96.png",sizes:"96x96",type:"image/png"},
   {url:"/favicon-192x192.png",sizes:"192x192",type:"image/png"},
   {url:"/favicon-512x512.png",sizes:"512x512",type:"image/png"},
  ],
  shortcut:"/favicon.ico",
  apple:[{url:"/apple-touch-icon.png",sizes:"180x180",type:"image/png"}],
 },
 robots:{index:!!siteUrl,follow:true,googleBot:{index:!!siteUrl,follow:true,"max-image-preview":"large"}},
 openGraph:{type:"website",siteName:"CrewVerse",locale:"en_IN"},
};
export default async function RootLayout({children}: Readonly<{children:React.ReactNode}>) {
 const {company} = await getWebsite();
 const schema = {"@context":"https://schema.org","@type":"Organization",name:company.name,
  telephone:company.phone,email:company.email,
  ...(siteUrl ? {url:siteUrl,logo:`${siteUrl}/images/logo.webp`} : {}),
 };
 return <html lang="en-IN"><body><a href="#main" className="skip-link">Skip to content</a>
 <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
 <AnimationController/><Header/><main id="main">{children}</main><Footer/></body></html>;
}
