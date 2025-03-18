import React from 'react';
import BluredEval from '../../_components/blured-eval';
import Image from 'next/image';
import SignUpForm from './_components/sign-up-form';
import Link from 'next/link';

async function SignUp() {
    return (
        <div className="z-10 flex flex-col items-center gap-10 w-full">
            <h1 className="text-2xl font-semibold text-black w-full text-center hidden md:block">
                지금 바로 가입하고 소중한 사람에게 마음을 전하세요.
            </h1>

            <h1 className="text-2xl font-semibold text-black w-full text-left block md:hidden">
                지금 바로 가입하고
                <br /> 소중한 사람에게 마음을 전하세요.
            </h1>
            <SignUpForm />
            <div className="h-32 md:h-64"></div>
        </div>
    );
}

export default SignUp;
