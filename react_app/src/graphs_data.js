import heat_map from "./images/heat_map.png";
import model_diagram from "./images/model_diagram.png";
import training_validation from "./images/training_validation.png";

const graphs_data = [
  {
    title: "Heat Map of the Model's Confusion Matrix",
    src: heat_map,
    altText: "Heat Map",
    description: `The confusion matrix shows a distribution of true positives (TP=4439), true negatives (TN=5478), false positives (FP=4522), and false negatives (FN=5561). 
      The relatively high numbers of false positives and false negatives compared to true positives and true negatives highlighted a challenge in achieving balance in the model's sensitivity (recall) and specificity. 
      This imbalance suggested that while the model was generally accurate, its ability to consistently identify FAKE images without mistakenly classifying REAL images as FAKE (or vice versa) could be enhanced.`,
    style: {
      width: "750px",
      height: "450px",
      borderRadius: "10px",
      marginTop: "15px",
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  {
    title: "Model Diagram",
    src: model_diagram,
    altText: "Model Diagram",
    description: `The above image shows the architecture of the model using the ResNet50V2 as a base layer, followed by a classification head. 
    It begins with an input layer designed for images of size 32x32 pixels with 3 channels (RGB color channels). 
    The core of the network is a pre-trained ResNet50V2 model on ImageNet dataset, which processes the input and outputs a 2048-dimensional feature vector. 
    This vector is then passed through a dense (fully connected) layer that reduces the dimensionality to 256, followed by a dropout layer for regularization, which helps prevent overfitting by randomly setting input units to 0 at each update during training time. 
    The final dense layer outputs a single value necessary for a binary classification task. The value represents the probability of the input image being real (0) or fake (1). 
    `,
    style: {
      width: "450px",
      height: "350px",
      borderRadius: "10px",
      marginTop: "45px",
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  {
    title: "Training and Validation Graphs",
    src: training_validation,
    altText: "Training and Validation",
    description: `The above graphs depict the performance of the model during and after the training. 
    Training accuracy and loss improve consistently, suggesting effective learning. 
    However, the variability in validation loss and the occasional divergences between training and validation accuracy hint at possible overfitting. 
    To enhance generalization and stabilize validation performance, strategies such as dropout, data augmentation, and learning rate adjustments could be considered.`,
    style: {
      width: "850px",
      height: "450px",
      marginTop: "15px",
      marginLeft: "auto",
      marginRight: "auto",
      borderRadius: "10px",
    },
  },
];

export default graphs_data;
