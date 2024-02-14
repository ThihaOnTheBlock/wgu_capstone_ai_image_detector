import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import Modal from "react-modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/css/pagination";

Modal.setAppElement("#root");

const CarouselModal = ({ data }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [currentIdx, setCurrentIdx] = useState(0);

  const customStyles = {
    content: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "50%",
      height: "80%",
      margin: "auto",
      borderRadius: "10px",
      // background: "linear-gradient(to right, #38b2ac, #3b82f6)", // gradient background

      className: "modal-content",
    },
    overlay: {
      zIndex: 1000,
    },
  };

  return (
    <>
      <button style={{ fontSize: "15px" }} onClick={() => setModalIsOpen(true)}>
        View the visualizations of the model
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        shouldCloseOnOverlayClick={false}
      >
        <MdClose
          cursor="pointer"
          onClick={() => {
            setModalIsOpen(false);
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "20px",
          }}
        />
        <h1 className="mt-5 text-center text-3xl font-bold font-mono">
          {data[currentIdx].title}
        </h1>
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          onSlideChange={(swiper) => {
            setCurrentIdx(swiper.activeIndex);
            console.log(swiper.activeIndex);
          }}
          onSwiper={(swiper) => console.log(swiper)}
          navigation={true}
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
        >
          {data.map((graph, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={graph.src}
                  alt={`Slide ${index}`}
                  style={graph.style}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <h1 className="text-sm text-center mt-5 mb-5 leading-relaxed font-bold font-mono">
          {data[currentIdx].description}
        </h1>
      </Modal>
    </>
  );
};

export default CarouselModal;
