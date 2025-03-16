import React from 'react';
import BluredEval from '../_components/blured-eval';
import Image from 'next/image';
import SignUpForm from './_components/sign-up-form';

async function SignUp() {
    return (
        <main className="flex min-h-screen flex-col justify-center items-center space-y-10 relative">
            <div className="absolute -top-[25%] left-0 w-full h-full overflow-visible z-0">
                <BluredEval />
            </div>
            <Image src="/logo.png" alt="logo" width={180} height={80} />
            <h1 className="text-2xl font-semibold text-black w-full text-center hidden md:block">
                지금 바로 가입하고 소중한 사람에게 마음을 전하세요.
            </h1>

            <h1 className="text-2xl font-semibold text-black w-full text-left pl-10 block md:hidden">
                지금 바로 가입하고
                <br /> 소중한 사람에게 마음을 전하세요.
            </h1>
            <SignUpForm />
            <div className="h-64"></div>
        </main>
    );
}

export default SignUp;
