export default function Banner() {
    return (
        <div className="mb-2">
            <div className="flex justify-between items-center w-full h-[140px] px-[100px] py-6 rounded-lg bg-secondary-babypink">
                <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[171px] gap-2">
                    <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1">
                        <svg
                            width={24}
                            height={25}
                            viewBox="0 0 24 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M17.9847 17.7304V19.9885C17.9856 20.1981 17.9426 20.4056 17.8586 20.5977C17.7747 20.7898 17.6515 20.9622 17.497 21.1039C17.3425 21.2456 17.1602 21.3535 16.9616 21.4207C16.763 21.4878 16.5526 21.5128 16.3438 21.4939C14.0276 21.2422 11.8028 20.4508 9.84801 19.1831C8.02935 18.0274 6.48745 16.4855 5.3318 14.6669C4.05971 12.7032 3.26807 10.4676 3.021 8.14096C3.00219 7.93282 3.02693 7.72303 3.09364 7.52497C3.16035 7.32691 3.26757 7.1449 3.40847 6.99055C3.54937 6.83619 3.72087 6.71287 3.91204 6.62843C4.10322 6.54398 4.30988 6.50027 4.51888 6.50007H6.77698C7.14227 6.49648 7.49641 6.62583 7.77338 6.86403C8.05035 7.10222 8.23126 7.43301 8.28239 7.79472C8.3777 8.51736 8.55445 9.22691 8.80928 9.90981C8.91055 10.1792 8.93247 10.472 8.87243 10.7535C8.8124 11.035 8.67294 11.2934 8.47056 11.498L7.51463 12.4539C8.58614 14.3384 10.1464 15.8986 12.0308 16.9702L12.9868 16.0142C13.1914 15.8118 13.4498 15.6724 13.7313 15.6123C14.0128 15.5523 14.3056 15.5742 14.575 15.6755C15.2579 15.9303 15.9674 16.1071 16.6901 16.2024C17.0557 16.254 17.3896 16.4381 17.6283 16.7199C17.867 17.0016 17.9939 17.3612 17.9847 17.7304Z"
                                fill="#4F4F4F"
                            />
                            <path
                                d="M12 4.5L13.1074 4.72148C16.888 5.47759 19.7043 8.65591 20 12.5V12.5"
                                stroke="#4F4F4F"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M13 7.5L13.6283 7.70943C15.1213 8.20711 16.2929 9.37868 16.7906 10.8717L17 11.5"
                                stroke="#4F4F4F"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p className="flex-grow-0 flex-shrink-0 text-xl font-semibold text-left text-[#131200]">
                            1234-5678
                        </p>
                    </div>
                    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-px">
                        <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                            <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-[#8c8c8c]">
                                고객센터(전화):
                            </p>
                            <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left">
                                <span className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-[#4f4f4f]">
                                    09:00 - 18:00
                                </span>
                                <span className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-[#8c8c8c]">
                                    {' '}
                                    운영
                                </span>
                            </p>
                        </div>
                        <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-0.5">
                            <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-[#8c8c8c]">
                                카카오톡 문의:
                            </p>
                            <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left">
                                <span className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-[#4f4f4f]">
                                    24시간
                                </span>
                                <span className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-[#8c8c8c]">
                                    {' '}
                                    운영
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-start items-center gap-2.5 px-6 py-3 rounded-[10px] bg-white border border-[#f3f3f3] wif-t">
                    <div className="flex justify-start items-center relative gap-2.5 w-fit">
                        <svg
                            width={18}
                            height={16}
                            viewBox="0 0 18 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="flex-grow-0 flex-shrink-0 w-[17px] h-[15px]"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M9 0.5C10.5368 0.5 11.9582 0.785709 13.2642 1.35713C14.5702 1.92855 15.6027 2.70556 16.3616 3.68815C17.1205 4.67075 17.5 5.74254 17.5 6.90352C17.5 8.0645 17.1205 9.1378 16.3616 10.1234C15.6027 11.109 14.5718 11.8876 13.269 12.459C11.9661 13.0304 10.5432 13.3161 9 13.3161C8.51302 13.3161 8.01023 13.2829 7.49163 13.2163C5.24014 14.7099 4.04167 15.4657 3.89621 15.4839C3.82664 15.5081 3.76023 15.505 3.69699 15.4748C3.67169 15.4567 3.65272 15.4325 3.64007 15.4022C3.62742 15.372 3.62109 15.3448 3.62109 15.3206V15.2843C3.65904 15.0485 3.9468 14.0659 4.48438 12.3365C3.26376 11.756 2.29455 10.9866 1.57673 10.0282C0.85891 9.06977 0.5 8.02822 0.5 6.90352C0.5 5.74254 0.879464 4.67075 1.63839 3.68815C2.39732 2.70556 3.42978 1.92855 4.73577 1.35713C6.04176 0.785709 7.46317 0.5 9 0.5Z"
                                fill="#4F4F4F"
                            />
                        </svg>
                        <p className="flex-grow-0 flex-shrink-0 text-lg font-medium text-left text-[#4f4f4f]">
                            카카오 문의
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
