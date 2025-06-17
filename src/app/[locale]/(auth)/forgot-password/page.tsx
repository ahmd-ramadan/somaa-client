import AuthLayout from "../_components/AuthLayout"
import ForgetPasswordForm from "../_components/ForgetPasswordForm";

const ForgetPasswordPage = () => {
    return (
        <AuthLayout haveGoogleSignIn={false}>
            <ForgetPasswordForm />
        </AuthLayout>
    );
};

export default ForgetPasswordPage;
