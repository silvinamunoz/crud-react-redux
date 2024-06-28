import { Badge, Button, Card, TextInput, Title } from "@tremor/react"
import { useUserActions } from "../hooks/useUserActions"
import { useState } from "react";

export const CreateNewUser = () => {
    const { addUser } = useUserActions();
    const [result, setResult] = useState<string>();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const github = formData.get('github') as string;

        if (!name || !email || !github) {
            return setResult('ko');
        }
        addUser({ name, email, github });
        setResult('ok');
        form.reset();
    }
    return (
        <Card className="mt-4">
            <Title>
                Create new user
            </Title>
            <form onSubmit={handleSubmit}>
                <TextInput name="name" placeholder="Aqui el nombre" />
                <TextInput name="email" placeholder="Aqui el email" />
                <TextInput name="github" placeholder="Aqui el github" />
                <Button type="submit" className="mt-4" >
                    Crear Usuario
                </Button>
                <span>
                    {result === 'ok' && <Badge color="green">Guardado correctamente</Badge>}
                    {result === 'ko' && <Badge color="red">Hubo un error con los valores</Badge>}
                </span>
            </form>
        </Card>
    )
}