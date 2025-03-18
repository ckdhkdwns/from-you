import React, { Suspense } from 'react';
import LoginForm from './_components/login-form';
import Image from 'next/image';
import BluredEval from '../../_components/blured-eval';
import RedirectedToast from '../../_components/redirected-toast';
import Link from 'next/link';

async function Login() {
    return (
        <div className="z-10 flex flex-col items-center gap-10 w-full">
            <h1 className="text-2xl font-semibold text-black w-full text-center hidden md:block">
                소중한 마음을 전하기 위해 로그인하세요!
            </h1>

            <h1 className="text-2xl font-semibold text-black w-full text-left pl-10 block md:hidden">
                소중한 마음을
                <br /> 전하기 위해 로그인하세요!
            </h1>
            <LoginForm />
        </div>
    );
}

export default Login;
