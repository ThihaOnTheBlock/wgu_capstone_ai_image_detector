import ImageUploader from "react-image-upload";
import "react-image-upload/dist/index.css";
import ClipLoader from "react-spinners/ClipLoader";
import { AiFillYuque, AiFillSafetyCertificate } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { FaRobot, FaFileUpload } from "react-icons/fa";

import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as tf from "@tensorflow/tfjs";

import CarouselModal from "./ModalWithCarousel";

import graphs_data from "./graphs_data.js";

import { BeatLoader } from "react-spinners";

console.log(graphs_data);
const node_env = process.env.NODE_ENV;
let app_url = null;

if (node_env === "development") {
  console.log("Development Mode");
  app_url = "http://localhost:3000/wgu_capstone_ai_image_detector";
} else if (node_env === "production") {
  console.log("Production Mode");
  app_url = process.env.REACT_APP_PUBLIC_URL;
} else {
  console.log("Unknown Mode");
  app_url = "http://localhost:3000/wgu_capstone_ai_image_detector";
}

function App() {
  const [isAiGenerated, setIsAiGenerated] = useState(null);

  const [model, setModel] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const [imageUploaded, setImageUploaded] = useState(null);

  const [imageTensor, setImageTensor] = useState(null);

  const [detectionProbability, setDetectionProbability] = useState(0);

  const preprocessImage = (imageObj) => {
    // Preprocess the image (resize, normalize, etc.)
    console.log(JSON.stringify(imageObj));
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageObj.dataUrl;
    img.onload = () => {
      console.log("Image dimensions:" + img.width + " x " + img.height);
      const tensor = tf.browser
        .fromPixels(img)
        .resizeNearestNeighbor([32, 32]) // Resize image to match the dataset
        .toFloat()
        .div(tf.scalar(255)) // Example normalization
        .expandDims();

      console.log(tensor);
      setImageTensor(tensor);
    };
    img.onerror = (error) => {
      toast.error("Error loading the image");
      console.log(error);
      return;
    };
  };

  const handleDetection = () => {
    if (imageUploaded == null) {
      toast.error("Upload an image first!");
      return;
    }
    try {
      setIsLoading(true);

      console.log("Image Tensor:" + imageTensor);

      const detection = model.predict(imageTensor);

      const detectionValue = detection.dataSync()[0];

      const probability = detectionValue * 100;

      setDetectionProbability(parseFloat(probability.toFixed(2)));

      if (detectionValue >= 0.5) {
        setIsAiGenerated(false);
      } else {
        setIsAiGenerated(true);
      }
      setIsLoading(false);
      console.log("Detection Result: " + detectionValue);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
      toast.error("Something went wrong!");
      return;
    }
  };
  const onFileRemoved = () => {
    setIsAiGenerated(null);
    setImageUploaded(null);
    setIsLoading(false);
    setDetectionProbability(0);
    setImageUploaded(null);
    setImageTensor(null);
  };
  const onFileAdded = (img) => {
    setImageUploaded(img);
    preprocessImage(img);
  };

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel(
          `${app_url}/models/model.json`
        );
        setModel(loadedModel);
        setIsModelLoaded(true);
        toast.success("Model successfully loaded!");
      } catch (error) {
        console.error("Error loading the model", error);
        toast.error("Error loading the model!");
      }
    };

    loadModel();
  }, []);

  function Footer() {
    return (
      <div className="flex fixed inset-x-0 bottom-0 bg-gray-900 w-[100%] text-white text-center p-4 mt-8">
        <div className="text-xs">
          <p>Author: Thiha Min Zaw</p>
          <p>tminzaw7@wgu.edu</p>
          <p>WGU Capstone Project</p>
        </div>
        <div className="mx-auto">
          <p>© 2024 NaturePixels.co</p>
          <p className="text-xs text-red-600">
            Disclaimer: The organization and trademark mentioned above are
            fictional and any resemblance to real entities is purely
            coincidental.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="App fixed flex flex-col items-center space-y-16 bg-gradient-to-r from-green-400 to-blue-500 h-screen w-screen">
      <h1 className="text-4xl sm:text-6xl font-bold text-white mt-11 font-mono flex">
        <AiFillYuque className="mr-5" />
        <span className="text-center">NaturePixels Studio</span>
      </h1>
      {isModelLoaded ? (
        <div className="flex flex-col w-full items-center space-y-10">
          <h3 className="text-sm sm:text-2xl font-bold text-white text-center font-mono">
            Upload an image below to detect whether it is AI-generated or real.
          </h3>
          <div className="flex flex-col sm:flex-row space-x-16 space-y-12">
            <div className="flex justify-center">
              <ImageUploader
                style={{
                  height: 300,
                  width: 300,
                  background: "white",
                  borderRadius: "10px",
                }}
                imgExtension={[".jpg", ".png", ".gif"]}
                onFileRemoved={onFileRemoved}
                onFileAdded={(img) => {
                  onFileAdded(img);
                }}
                uploadIcon={
                  <FaFileUpload
                    style={
                      imageUploaded != null
                        ? { display: "none" }
                        : { display: "block" }
                    }
                    className="text-blue-500 text-4xl"
                  />
                }
                deleteIcon={
                  <MdDelete
                    style={
                      imageUploaded != null
                        ? { display: "block" }
                        : { display: "none" }
                    }
                    className="text-red-500 hover:text-white text-3xl"
                  />
                }
              />
            </div>
            <div className="">
              <div
                className={`bg-white mr-16 w-[400px] h-[200px] text-xl font-bold flex flex-col items-center justify-center rounded-lg font-mono ${
                  isAiGenerated == null
                    ? "text-blue-600"
                    : isAiGenerated
                      ? "text-red-600"
                      : "text-green-400"
                }`}
              >
                <div className="flex mb-4">
                  {isLoading ? (
                    <ClipLoader color="blue" loading={true} size={30} />
                  ) : isAiGenerated == null ? (
                    "Upload an image to detect"
                  ) : isAiGenerated ? (
                    "This image is ai-generated"
                  ) : (
                    "This image is real"
                  )}

                  {isAiGenerated == null ? (
                    ""
                  ) : isAiGenerated ? (
                    <FaRobot
                      className="mt-auto mb-auto ml-2"
                      style={isLoading ? { display: "none" } : {}}
                    ></FaRobot>
                  ) : (
                    <AiFillSafetyCertificate
                      className="mt-auto mb-auto ml-2"
                      style={isLoading ? { display: "none" } : {}}
                    ></AiFillSafetyCertificate>
                  )}
                </div>
                <h3 className="text-black text-sm">
                  Probability Score: {detectionProbability} %
                </h3>
                <h3 className="text-black text-sm">
                  Model - Convolutional Neural Networks{" "}
                </h3>
                <h3 className="text-black text-sm">Model Accuracy - 93%</h3>
                <h3 className="text-black text-sm">Dataset - CIFake </h3>

                <CarouselModal data={graphs_data} />
              </div>
            </div>
          </div>
          <button
            onClick={handleDetection}
            className="bg-blue-600 hover:bg-blue-700 text-white w-20 mx-auto font-bold py-2 px-4 rounded"
          >
            Detect
          </button>
          <ToastContainer />
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-8">
          <h3 className="text-2xl text-center font-bold text-white font-mono">
            Loading the image classifier model...
          </h3>
          <BeatLoader color="white" loading={true} size={20} />
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
