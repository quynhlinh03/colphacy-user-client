import { Button, Flex, Image, Rating, Textarea } from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { handleGlobalException } from "../../../utils/error";
import { notificationShow } from "../../Notification";
import { ErrorObject } from "../../../types/error";
import { useReview } from "../../../hooks/useReview";
export const ReviewForm: React.FC<ReviewForm> = ({
  id,
  name,
  image,
  onSuccesSubmitAdd,
}) => {
  const { onSubmitAddReviewForm } = useReview();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      productId: id,
      rating: 5,
      content: "",
    },
  });
  const onSubmit: SubmitHandler<Review> = (data) => {
    onSubmitAddReviewForm(
      data,
      (error) => {
        const newError = error as ErrorObject;
        handleGlobalException(newError, () => {
          if (newError.response.status === 400) {
            const data = newError.response.data;
            Object.keys(data).forEach((key) => {
              notificationShow("error", "Error!", data[key]);
              onSuccesSubmitAdd();
            });
          }
        });
      },
      () => {
        ;
        onSuccesSubmitAdd();
        notificationShow("success", "Success!", "Thêm đánh giá thành công!");
      }
    );
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
      >
        <Flex gap="md" direction="row" justify="center" align="center">
          <Image
            width="100px"
            height="100px"
            radius="lg"
            fit="scale-down"
            src={image}
          />
          <span>{name}</span>
        </Flex>
        <Controller
          name="rating"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <Rating
              {...field}
              defaultValue={5}
              onChange={(value) => {
                field.onChange(value);
              }}
            />
          )}
        ></Controller>
        <Controller
          name="content"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <Textarea
              {...field}
              w="100%"
              placeholder="Nhập nội dung đánh giá (Không bắt buộc)"
              error={errors.content ? errors.content.message : false}
              radius="md"
            />
          )}
        ></Controller>

        <Button
          fullWidth
          styles={(theme) => ({
            root: {
              backgroundColor: theme.colors.munsellBlue[0],
              ...theme.fn.hover({
                backgroundColor: theme.fn.darken(
                  theme.colors.munsellBlue[0],
                  0.1
                ),
              }),
            },
          })}
          type="submit"
        >
          Gửi
        </Button>
      </Flex>
    </form>
  );
};
