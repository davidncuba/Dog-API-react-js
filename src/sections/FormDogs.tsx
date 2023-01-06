import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { FormProvider } from "../components/FormProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  AlertColor,
  createTheme,
  ImageList,
  ImageListItem,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { Select } from "../components/Select";
import AllDogsService from "../services/";
import { DogBreeds, DogSubBreeds } from "../@types";
import { SnackBar } from "../components/SnackBar";

export function FormDogs() {
  const theme = createTheme();
  const [dogsBreeds, setDogsBreeds] = useState<DogBreeds[]>([]);
  const [isSubBreeds, setIsSubBreeds] = useState<boolean>(false);
  const [dogsSubBreeds, setDogsSubBreeds] = useState<DogSubBreeds[]>([]);
  const [imagesNumber, setImagesNumber] = useState<number>(0);
  const [dogsImages, setDogsImages] = useState<DogBreeds[]>([]);
  const [imagensRequest, setImagensRequest] = useState<DogBreeds[]>([]);
  const [indexSelectedDog, setIndexSelectedDog] = useState<number>(0);
  const [openSnack, setOpenSnack] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor | undefined>(undefined);

  const FormSchema = Yup.object().shape({
    breed: Yup.string().required("Breed is required"),
    sub_breed: Yup.string().when([], {
      is: () => isSubBreeds === true,
      then: Yup.string().required("Sub Breed is required"),
    }),
    number_image: Yup.string().required("Number of images is required"),
  });

  type FormValuesProps = {
    breed: string;
    sub_breed: string;
    number_image: string;
  };

  const defaultValues = {
    breed: "",
    sub_breed: "",
    number_images: "",
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const images = imagensRequest.slice(0, Number(data.number_image));
    setDogsImages(images);
    setOpenSnack(true);
    setMessage("success");
    setSeverity("success");
  };
  const matchDownMd = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    AllDogsService.getAllBreeds().then((data) => {
      console.log(data.data.status);
      if (data.data.status === "error") {
        setOpenSnack(true);
        setMessage("error");
        setSeverity("error");
      } else {
        setDogsBreeds(Object.entries(data.data.message));
      }
    });
  }, []);

  const getImages = (breed: string) => {
    AllDogsService.getAllImages(breed).then((data) => {
      if (data.data.status === "error") {
        setOpenSnack(true);
        setMessage("error");
        setSeverity("error");
      } else {
        console.log(data);
        setImagensRequest(data.data.message);
        setImagesNumber(data.data.message.length);
      }
    });
  };

  const onChangeBreed = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue("breed", e.target.value, { shouldValidate: true });
    setValue("sub_breed", "");
    setValue("number_image", "");
    if (dogsBreeds[Number(e.target.value)][1].length > 0) {
      setIsSubBreeds(true);
      setDogsSubBreeds(dogsBreeds[Number(e.target.value)][1]);
      setImagesNumber(0);
      setIndexSelectedDog(Number(e.target.value));
    } else {
      setIsSubBreeds(false);
    }
    getImages(dogsBreeds[Number(e.target.value)][0]);
  };

  const onChangeSubBreed = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue("sub_breed", e.target.value, {
      shouldValidate: true,
    });
    setValue("number_image", "");
    if (e.target.value !== "all") {
      getImages(
        dogsBreeds[indexSelectedDog][0] +
          "/" +
          dogsSubBreeds[Number(e.target.value)]
      );
    }
  };

  const onChangeNumberImage = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue("number_image", e.target.value, {
      shouldValidate: true,
    });
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 3, sm: 2 }}>
        <Select
          name="breed"
          label="Breed"
          onChange={(e) => {
            onChangeBreed(e);
          }}
        >
          <option key={0}></option>
          {dogsBreeds.map((data, index) => (
            <option key={index} value={index}>
              {data[0]}
            </option>
          ))}
        </Select>
        {isSubBreeds && (
          <Select
            name="sub_breed"
            label="Sub Breed"
            onChange={(e) => {
              onChangeSubBreed(e);
            }}
          >
            <option key={-1}></option>
            <option key={0} value={"all"}>
              All
            </option>
            {dogsSubBreeds.map((data, index) => (
              <option key={index} value={index}>
                {data}
              </option>
            ))}
          </Select>
        )}

        <Select
          name="number_image"
          label="Number of Images"
          onChange={(e) => {
            onChangeNumberImage(e);
          }}
        >
          <option key={0}></option>
          {Array.from(Array(imagesNumber).keys()).map((index) => (
            <option key={index + 1} value={index + 1}>
              {String(index + 1)}
            </option>
          ))}
        </Select>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={() => {
            handleSubmit(onSubmit);
          }}
        >
          View Images
        </LoadingButton>
      </Stack>
      <ImageList
        sx={{ width: "auto", height: "auto" }}
        variant="woven"
        cols={matchDownMd ? 2 : 5}
        gap={8}
      >
        {dogsImages.map((item, index) => (
          <ImageListItem key={index}>
            <img
              src={`${item}?w=248&fit=crop&auto=format`}
              srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
      <SnackBar
        openSnack={openSnack}
        setOpenSnack={setOpenSnack}
        message={message}
        severity={severity}
      />
    </FormProvider>
  );
}
