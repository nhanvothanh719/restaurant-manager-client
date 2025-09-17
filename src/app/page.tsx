import ButtonRedirect from "@/app/components/ButtonRedirect";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          src="https://people.com/thmb/tptLCJyCtLCDN7t8TBqGwBrIlHA=/4000x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(599x0:601x2)/Taylor-Swift-Releases-Life-of-a-Showgirl-Themed-Spotify-Playlist-081225-588d52b38b0c4a83a459aff7d824875f.jpg"
          alt="lucky-hirono"
          width={300}
          height={300}
          quality={100}
        />
        <ul>
          <li>
            <Link href={"/login"}>Login</Link>
          </li>
          <li>
            <ButtonRedirect />
          </li>
        </ul>
      </main>
    </div>
  );
}
