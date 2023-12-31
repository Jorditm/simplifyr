import clsx from "clsx";
import {CircleArrowRight, CircleCheck, CircleMinus, CirclePlus} from "@/components/Icons";
import {Message} from "@/components/Message";
import {ChangeEvent, useEffect, useState} from "react";
import {StepChildrenProps} from "@/components/Decision";
import Select, {Option} from "@/components/Select";
import {Reorder} from "framer-motion";
import {useTranslations} from "next-intl";


interface ReasonProps {
    description: string;
    value: number;
}

interface IOptions {
    id: number;
    label: string;
    pros: ReasonProps[];
    cons: ReasonProps[];
    average: number;
}

interface ProsAndConsProps extends StepChildrenProps {
    options: IOptions[];
    setOptions: (value: any) => void;
    selectedOption?: IOptions;
}


export const Options = ({
                            currentStep,
                            setCurrentStep,
                            messageError,
                            setMessageError,
                            showMessageError
                        }: StepChildrenProps) => {
    const [options, setOptions] = useState<IOptions[]>([]);
    const [optionId, setOptionId] = useState(1);
    const [nameOption, setNameOption] = useState("");
    const [selectedOption, setSelectedOption] = useState<IOptions>();
    const t = useTranslations("index")

    const handleAddOption = (e: any) => {
        if (e.key === "Enter") {
            addOption();
        }
    };

    const addOption = () => {
        if (options.length < 3) {
            if (nameOption.length > 0) {
                setOptions((prev) => [
                    ...prev,
                    {id: optionId, label: nameOption, pros: [], cons: [], average: 0},
                ]);
                setOptionId(optionId + 1)
                setNameOption("");
            } else {
                showMessageError("empty", "option")
            }
        } else if (options.length === 3 && nameOption.length === 0) {
            setNameOption("");
        } else {
            showMessageError("limit", "option");
            setNameOption("");
        }
    }

    useEffect(() => {
        if (currentStep === 3 && options.length > 1) {
            const defaultOption = options.filter((option) => option.id === 1)[0]
            setSelectedOption(defaultOption)
        }
    }, [currentStep])


    return (
        <>
            <div className="mx-auto mt-8">
                <label htmlFor="option" className="text-4xl">
                    {t("stepTwo.question")}
                </label>
                <div
                    className={clsx("flex items-center justify-between border-b-2  mb-1 transition-colors duration-300",
                        options.length == 3 ? "border-gray-600" : "border-white",
                        messageError.group === "option" ? "border-b-red-500" : "")}>
                    <input
                        disabled={currentStep > 2}
                        type="text"
                        id="option"
                        name="option"
                        placeholder={t("stepTwo.placeholder")}
                        value={nameOption}
                        onChange={(e) => setNameOption(e.target.value)}
                        onKeyDown={(e) => handleAddOption(e)}
                        className={clsx(
                            "w-2/3 py-4 border-0 bg-transparent text-2xl placeholder:pl-2 pl-2 focus:outline-none focus:border-none text-white",
                            messageError.active ? "text-red-600" : ""
                        )}
                    />
                    <button onClick={() => addOption()}>
                        {currentStep > 2 ? (
                            <CircleCheck className={"stroke-green-300"}/>
                        ) : (
                            <CirclePlus
                                className={clsx(
                                    "icon icon-tabler icon-tabler-circle-plus transition-colors duration-300",
                                    options.length == 3 ? "stroke-gray-600 cursor-default" : "stroke-white",
                                    messageError.group === "option" && messageError.type === "limit" ? "stroke-red-500" : "")}
                            />
                        )}
                    </button>
                </div>
                {messageError.group === "option" && (
                    <Message
                        message={messageError.type === "limit" ? t("errorMessageLimit") : t("errorMessageEmpty")}
                        variant="alert"/>
                )}

                <Reorder.Group axis="y" onReorder={setOptions} values={options}>
                    <div className="mt-4 flex flex-col gap-y-2">
                        {options.map((option, idx) => {
                            return (
                                <Reorder.Item key={option.id} value={option} dragListener={false}>
                                <div
                                    className={clsx("cursor-grab reorder-handle w-full bg-gray-700 rounded-md shadow-sm shadow-gray-700  flex items-center justify-between px-2",
                                        currentStep > 2 && "cursor-pointer",
                                        currentStep > 2 && selectedOption?.id === option.id ? " border-2 bg-white text-gray-700 font-bold py-2" : "py-1.5")}
                                    onClick={() => setSelectedOption(option)}>
                                    <span>{option.label}</span>
                                    <div className={"flex justify-between gap-2"}>

                                        {currentStep === 2 ?
                                            (<button
                                                disabled={currentStep > 2}
                                                onClick={() => {
                                                    setOptions((prev) => {
                                                        return prev.filter((element) => (element.id !== option.id));
                                                    });
                                                }}
                                            >
                                            <CircleMinus className={clsx("stroke-red-500 w-7 h-7 fill-gray-700")}/>
                                        </button>
                                            ) : (
                                            <>
                                               {idx === 0 && <span className={clsx("text-xs text-center py-1 px-1.5 rounded border border-white bg-green-500",  currentStep > 2 && selectedOption?.id === option.id ? "text-white bg-green-700" : "text-black bg-green-500")}>Best option</span>}
                                                <span> #{option.average}</span>
                                            </>
                                            )
                                        }

                                    </div>

                                </div>
                                </Reorder.Item>

                            );
                        })}
                        </div>
                </Reorder.Group>

                {options.length >= 2 && (
                    <div className={"flex justify-between items-center mt-4"}>
                        <Message
                            message={t("stepTwo.message")}/>
                        <button onClick={() => setCurrentStep(3)}>
                            <CircleArrowRight className={"w-8 h-8 stroke-white"}/>
                        </button>

                    </div>
                )}
            </div>
            {
                currentStep > 2 && <ProsAndCons options={options} setOptions={setOptions}
                                                currentStep={currentStep} setCurrentStep={setCurrentStep}
                                                showMessageError={showMessageError}
                                                selectedOption={selectedOption}
                                                messageError={messageError} setMessageError={setMessageError}/>
            }
</>
    )
}


const ProsAndCons = ({
                         currentStep,
                         setCurrentStep,
                         setOptions,
                         options,
                         selectedOption,
                         setMessageError,
                         showMessageError,
                         messageError
                     }: ProsAndConsProps) => {
    const [showSection, setShowSection] = useState(1);
    const [currentReason, setCurrentReason] = useState<ReasonProps>({description: "", value: 1});
    const t = useTranslations("index")


    const degrees = [
        {id: 1, value: 1, label: t("stepThree.degrees.1")},
        {id: 2, value: 2, label: t("stepThree.degrees.2")},
        {id: 3, value: 3, label: t("stepThree.degrees.3")},
        {id: 4, value: 4, label: t("stepThree.degrees.4")},
        {id: 5, value: 5, label: t("stepThree.degrees.5")},
        {id: 6, value: 6, label: t("stepThree.degrees.6")},
        {id: 7, value: 7, label: t("stepThree.degrees.7")},
        {id: 8, value: 8, label: t("stepThree.degrees.8")},
        {id: 9, value: 9, label: t("stepThree.degrees.9")},
    ]
    const [selectedDegree, setSelectedDegree] = useState(degrees[0]);

    const handleChangeReasons = (e: ChangeEvent<HTMLInputElement>) => {
        const {value, name} = e.target
        setCurrentReason((prevReason) => ({
            ...prevReason,
            [name]: value,
        }))
    }

    const handleChangeSelect = (selectedValue: Option) => {
        setSelectedDegree(selectedValue);
        setCurrentReason((prevReason) => ({
            ...prevReason,
            value: selectedValue.value as number,
        }))

    };
    const addReason = (type: "pros" | "cons", optionId?: number) => {
        const copyArrOptions = [...options]
        const newOptions = copyArrOptions.map((option) => {
            if (option.id === optionId) {
                if (option[type].length < 10) {
                    if (Object.values(currentReason).every((value) => value !== "")) {
                        option[type].push(currentReason)
                        handleAverage(option)
                        return option
                    } else {
                        showMessageError("empty", type);
                    }

                } else {
                    showMessageError("limit", type)
                }
            }
            setCurrentReason({description: "", value: 1})
            setSelectedDegree(degrees[0])
            return option;
        });

        setOptions(sortOptions(newOptions))
    };

    const deleteReason = (index: number, type: "pros" | "cons") => {
        setOptions((prevOptions: any) => {
            const newOptions = [...prevOptions];
            const copyOption = selectedOption;
            if (copyOption) {
                copyOption[type].splice(index, 1);
            }
            selectedOption = copyOption;
            handleAverage(copyOption as IOptions);
            return sortOptions(newOptions);

        });
    }


    const sortOptions = (options: IOptions[]) => {
        return options.sort((a: IOptions, b: IOptions) => {
            if (a.average > b.average) {
                return -1
            } else if (a.average < b.average) {
                return 1
            } else {
                return 0
            }
        })
    }

    const handleAverage = (option: IOptions) => {
        let sumCons = 0;
        let sumPros = 0;

        selectedOption?.pros.forEach((num) => {
            sumPros += Number(num.value);
        });

        selectedOption?.cons.forEach((num) => {
            sumCons += Number(num.value) * -1;
        });

        return option.average = sumPros + sumCons;
    };


    return (
        <div className="mx-auto mt-8">
            <div className="flex text-3xl justify-between items-center gap-4">
                <button
                    className={clsx("w-1/2 py-2 rounded-lg transition",
                        showSection === 1 ? "bg-white text-black" : "bg-gray-600 hover:bg-white text-gray-300 hover:text-black")}
                    onClick={() => {
                        setShowSection(1);
                    }}
                >
                    Pros
                </button>
                <button
                    className={clsx("w-1/2 py-2 rounded-lg transition",
                        showSection === 2 ? "bg-white text-black" : " bg-gray-600 hover:bg-white text-gray-300 hover:text-black")}
                    onClick={() => {
                        setShowSection(2)
                    }}
                >
                    Cons
                </button>
            </div>


            <div className="mt-2">
                {showSection === 1 && (
                    <div className={"mx-auto"}>
                        <div className={"flex flex-row gap-3"}>
                            <div className={clsx("w-4/6 border-b-2 border-white mb-1",
                                messageError.group === "pros" ? "border-b-red-500" : "")}>
                                <input
                                    type="text"
                                    id="description"
                                    name="description"
                                    placeholder={t("stepThree.placeholderPros")}
                                    value={currentReason?.description}
                                    onChange={(e) => handleChangeReasons(e)}
                                    className={clsx(
                                        "py-4 border-0 bg-transparent text-2xl placeholder:pl-2 pl-2 focus:outline-none focus:border-none text-white"
                                    )}
                                />
                            </div>

                            <div className={clsx("relative w-2/6 border-b-2 flex flex-row mb-1",
                                messageError.group === "pros" ? "border-b-red-500" : "border-white")}>
                                <div className={" w-full"}>
                                    <Select options={degrees} onChange={handleChangeSelect}
                                            selectedOption={selectedDegree}/>
                                </div>
                                <button onClick={() => addReason("pros", selectedOption?.id)}>
                                    <CirclePlus className={clsx("stroke-white")}/>
                                </button>
                            </div>
                        </div>
                        {messageError.group === "pros" && (
                            <Message
                                message={messageError.type === "empty" ? t("errorMessageEmptyReasons") : t("errorMessageLimitPros")}
                                variant="alert"/>
                        )}
                        <Message
                            message={t("stepThree.messagePros")}
                            variant="primary"/>
                        <div
                            className={"w-full flex flex-col justify-around gap-2 mt-4"}>
                            {selectedOption?.pros.map((pro, i) => {
                                return (
                                    <div
                                        key={i}
                                        className={"w-full bg-gray-700 rounded-md shadow-sm shadow-gray-700 py-1.5 flex items-center justify-between gap-2 px-2"}>
                                        <div className={"w-5/6"}>
                                            <span>{pro.description}</span>
                                        </div>
                                        <div className={"w-1/6"}>
                                            <span>{pro.value}</span>
                                        </div>
                                        <button
                                            className={"w-8"}
                                            onClick={() => deleteReason(i, "pros")}
                                        >
                                            <CircleMinus
                                                className={clsx("stroke-red-500 w-7 h-7 fill-gray-700")}/>
                                        </button>
                                    </div>

                                )
                            })}
                        </div>
                    </div>

                )}
                {showSection === 2 && (
                    <div className={"mx-auto"}>
                        <div className={"flex flex-row gap-3"}>
                            <div className={clsx("w-4/6 border-b-2 mb-1",
                                messageError.group === "cons" ? "border-b-red-500" : "border-white")}>
                                <input
                                    type="text"
                                    id="description"
                                    name="description"
                                    placeholder={t("stepThree.placeholderCons")}
                                    value={currentReason?.description}
                                    onChange={(e) => handleChangeReasons(e)}
                                    className={clsx(
                                        "py-4 border-0 bg-transparent text-2xl placeholder:pl-2 pl-2 focus:outline-none focus:border-none text-white"
                                    )}
                                />
                            </div>
                            <div className={clsx("relative w-2/6 border-b-2 flex flex-row mb-1",
                                messageError.group === "cons" ? "border-b-red-500" : "border-white")}>
                                <div className={" w-full"}>
                                    <Select options={degrees} onChange={handleChangeSelect}
                                            selectedOption={selectedDegree}/>
                                </div>
                                <button onClick={() => addReason("cons", selectedOption?.id)}>
                                    <CirclePlus className={clsx("stroke-white")}/>
                                </button>
                            </div>
                        </div>
                        {messageError.group === "cons" && (
                            <Message
                                message={messageError.type === "empty" ? t("errorMessageEmptyReasons") : t("errorMessageLimitCons")}
                                variant="alert"/>
                        )}
                        <Message
                            message={t("stepThree.messageCons")}
                            variant="primary"/>
                        <div
                            className={"w-full flex flex-col justify-around gap-2 mt-4"}>
                            {selectedOption?.cons.map((cons, i) => {
                                return (
                                    <div
                                        key={i}
                                        className={"w-full bg-gray-700 rounded-md shadow-sm shadow-gray-700 py-1.5 flex items-center justify-between gap-2 px-2"}>
                                        <div className={"w-5/6"}>
                                            <span>{cons.description}</span>
                                        </div>
                                        <div className={"w-1/6"}>
                                            <span>{cons.value}</span>
                                        </div>
                                        <button
                                            className={"w-8"}
                                            onClick={() => deleteReason(i, "cons")}
                                        >
                                            <CircleMinus
                                                className={clsx("stroke-red-500 w-7 h-7 fill-gray-700")}/>
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

            </div>
        </div>

    )
}
