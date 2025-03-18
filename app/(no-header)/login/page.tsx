import React, { Suspense } from 'react';
import LoginForm from './_components/login-form';
import Image from 'next/image';
import BluredEval from '../_components/blured-eval';
import RedirectedToast from '../_components/redirected-toast';
import Link from 'next/link';

async function Login() {
    return (
        <main className="flex min-h-screen flex-col justify-center items-center space-y-10 relative">
            {/* <input /> */}
            <Suspense fallback={<></>}>
                <RedirectedToast />
            </Suspense>
            <div className="absolute -top-[25%] left-0 w-full h-full overflow-visible z-0">
                <BluredEval />
            </div>
            <Link href="/" className="z-10">
                <Image src="/logo.png" alt="logo" width={180} height={80} />
            </Link>
            <h1 className="text-2xl font-semibold text-black w-full text-center hidden md:block">
                소중한 마음을 전하기 위해 로그인하세요!
            </h1>

            <h1 className="text-2xl font-semibold text-black w-full text-left pl-10 block md:hidden">
                소중한 마음을
                <br /> 전하기 위해 로그인하세요!
            </h1>
            <LoginForm />
            <div className="h-64"></div>
        </main>
    );
}

export default Login;
