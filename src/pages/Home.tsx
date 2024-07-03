import ProductItem from "../components/Product/ProductItem";
import { Image } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { handleGlobalException } from "../utils/error";
import { useProduct } from "../hooks/useProduct";
import { IconChevronDown } from "@tabler/icons-react";
// import advise from '../assets/images/tuvanduocsiuvanduocsi.webp';
// import drugstore from '../assets/images/nhathuocganday.webp';
import change from "../assets/images/change.png";
import freeDelivery from "../assets/images/free-delivery.png";
import subBanner from "../assets/images/subBanner.webp";
import banner1 from "../assets/images/banner1.webp";
import banner2 from "../assets/images/banner2.webp";
import banner3 from "../assets/images/banner3.webp";
import banner4 from "../assets/images/banner4.webp";
import banner5 from "../assets/images/banner5.webp";

interface BestSellersList {
  id: number;
  name: string;
  salePrice: number;
  unitName: string;
  unitId: number;
  image: string;
}

function Home() {
  const autoplay = useRef(Autoplay({ delay: 2000 }));
  const autoplaynew = useRef(Autoplay({ delay: 2000 }));
  const { fetchBestSellers } = useProduct();
  const [bestSellersList, setBestSellersList] = useState<BestSellersList[]>();

  useEffect(() => {
    async function fetchBestSellerProducts() {
      const data = await fetchBestSellers.refetch();
      if (data.isSuccess) {
        setBestSellersList(data.data.data);
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchBestSellerProducts();
  }, []);

  const images = [banner1, banner2, banner3, banner4, banner5];

  const slides = images.map((url) => (
    <Carousel.Slide key={url}>
      <Image radius="md" src={url} />
    </Carousel.Slide>
  ));

  const ITEMS_PER_PAGE = 8;
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE);

  const handleLoadMore = () => {
    setDisplayedItems((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <>
      <div className="advert">
        <Carousel
          maw={700}
          withIndicators
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
        >
          {slides}
        </Carousel>
        <div className="ad-right">
          <div className="ad-above">
            <Image radius="md" maw={300} src={subBanner} />
          </div>
          <div className="ad-below">
            {/* <div className="card">
              <Image my={10} maw={40} mx="auto" src={advise} />
              <p className="content">Tư vấn với dược sỹ </p>
            </div>
            <div className="card">
              <Image my={10} maw={40} mx="auto" src={drugstore} />
              <p className="content">
                Tìm nhà thuốc <br /> gần đây
              </p>
            </div> */}
            <div className="card">
              <Image my={10} maw={40} mx="auto" src={freeDelivery} />
              <p className="content">
                Miễn phí <br /> vận chuyển{" "}
              </p>
            </div>
            <div className="card">
              <Image my={10} maw={40} mx="auto" src={change} />
              <p className="content">
                Đổi trả trong <br /> 30 ngày
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="best-seller-product">
        <div className="title">
          <Carousel
            slideSize="14%"
            plugins={[autoplaynew.current]}
            onMouseEnter={autoplaynew.current.stop}
            onMouseLeave={autoplaynew.current.reset}
            slideGap="md"
            py={20}
            loop
            withControls={false}
            align="center"
            breakpoints={[
              { maxWidth: "md", slideSize: "50%" },
              { maxWidth: "sm", slideSize: "100%", slideGap: 0 },
            ]}
            bg="white"
            styles={(theme) => ({
              root: {
                color: theme.colors.cobaltBlue[0],
                fontWeight: 500,
              },
            })}
          >
            {Array(18)
              .fill(null)
              .map((_, i) => (
                <Carousel.Slide key={i} gap={0}>
                  SẢN PHẨM BÁN CHẠY
                </Carousel.Slide>
              ))}
          </Carousel>
        </div>
        <div className="list-product">
          {bestSellersList &&
            bestSellersList.slice(0, displayedItems).map((item, index) => {
              return (
                <ProductItem
                  id={item.id}
                  key={index}
                  name={item.name}
                  price={item.salePrice}
                  images={item.image}
                  unit={item.unitName}
                  unitId={item.unitId}
                />
              );
            })}
        </div>
        {bestSellersList && displayedItems < bestSellersList.length && (
          <div className="read-more" onClick={handleLoadMore}>
            <IconChevronDown className="icondown" size={16} />
            Xem thêm
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
