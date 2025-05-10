import { Container, Box, TextField } from "@mui/material";

type AddGroupDetailsProps = {
    name: string,
    setName: React.Dispatch<React.SetStateAction<string>>,
    description: string,
    setDescription: React.Dispatch<React.SetStateAction<string>>
};

const AddGroupDetails = ({name, setName, description, setDescription}: AddGroupDetailsProps) => {
    return (
        <Container maxWidth="md" sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ mt: 8, width: '60%', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center'}}>
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    label="Description"
                    multiline
                    fullWidth
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Box>
        </Container>
    )
};

export default AddGroupDetails;