"use client"

import { useState } from 'react';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Slider, Stack, Typography } from '@mui/material';
import { AspectRatio, GenerateImageSD3Params, OutputFormat, SD3Model, generateImageSD3 } from '../../ts/client/generate-image';
import GenerateImageForm from "./GenerateImageForm";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useRouter } from '../../ts/nextjs/navigation';

type GenerateImageSD3FormProps = {
    model?: string;
}

const GenerateImageSD3Form = ({ model }: GenerateImageSD3FormProps) => {
    const router = useRouter();
    const [value, setValue] = useState<GenerateImageSD3Params>({
        prompt: "",
        outputFormat: OutputFormat.PNG,
        aspectRatio: AspectRatio["1:1"],
        model: model as SD3Model
    });

    return (
        <GenerateImageForm value={value} onChange={r => setValue(r)} onSend={generateImageSD3} >
            <Stack
                spacing={{ xs: 2, sm: 1 }}
                direction={{ xs: 'column', sm: 'row' }}
                flexWrap="wrap"
                useFlexGap
                sx={{ mt: 2 }}>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Model</InputLabel>
                    <Select
                        value={value?.model}
                        label="Model"
                        onChange={e => {
                            const { value } = e.target
                            if (value)
                                router.set('model', e.target.value)
                            else
                                router.remove('model');
                        }}>
                        <MenuItem >None</MenuItem>
                        <MenuItem value={"sd3-medium"}>Medium</MenuItem>
                        <MenuItem value={"sd3-large"}>Large</MenuItem>
                        <MenuItem value={"sd3-large-turbo"}>Large Turbo</MenuItem>
                    </Select>
                </FormControl>
                <Button component='label'>
                    <input
                        key={value.image?.name}
                        type='file'
                        hidden
                        accept='image/*'
                        capture
                        onChange={e => {
                            const { files } = e.target;
                            if (files && files.length > 0)
                                setValue({ ...value, image: files[0] })
                        }} />
                    Upload image
                </Button>
                {value.image &&
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant='h5'>
                                {value.image.name}
                            </Typography>
                            <IconButton onClick={() => setValue({ ...value, image: undefined })}>
                                <RemoveCircleOutlineIcon />
                            </IconButton>
                        </Box>
                        <Box>
                            <Typography variant='body2'>Strength: {value.strength ?? 0}</Typography>
                            <Slider
                                min={0}
                                max={1}
                                step={0.01}
                                value={value.strength}
                                size='small'
                                onChange={(e, v) => setValue({ ...value, strength: v as number })}
                                sx={{ minWidth: 100 }} />
                        </Box>
                    </>
                }
            </Stack>
        </GenerateImageForm>
    )
}

export default GenerateImageSD3Form;