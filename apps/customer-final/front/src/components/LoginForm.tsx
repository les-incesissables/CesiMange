import ClickableText from './Buttons/ClickableText';

interface LoginFormProps {
    onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
    return (
        <div className="flex flex-col items-center gap-7">
            <h2 className="text-4xl font-normal text-black">Connexion</h2>
            <div className="w-full h-px outline-1 outline-black" />

            <div className="w-full flex flex-col gap-7 px-6">
                <div className="flex flex-col gap-2">
                    <label className="text-2xl text-black">Email :</label>
                    <input type="email" className="h-14 px-6 bg-white rounded-[20px] shadow outline outline-1 outline-black text-2xl" />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-2xl text-black">Mot de passe :</label>
                    <input type="password" className="h-14 px-6 bg-white rounded-[20px] shadow outline outline-1 outline-black text-2xl" />
                </div>
            </div>

            <button className="h-10 px-6 bg-black text-white font-bold rounded-[20px]">Valider</button>

            <div className="w-full h-px outline-1 outline-black" />

            <div className="w-full px-10 flex justify-between text-base text-black">
                <ClickableText text="S'inscrire" onClick={onSwitchToSignup} />
                <ClickableText text="Mot de passe oublié" />
            </div>
        </div>
    );
};

export default LoginForm;
