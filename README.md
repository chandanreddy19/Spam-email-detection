# 🛡️ Spam & Phishing Email Detection System

### AI-Powered Email Security Using NLP, Machine Learning, Mathematical Optimization & Generative AI

[![Python](https://img.shields.io/badge/Python-3.x-blue.svg)]()
[![React](https://img.shields.io/badge/React-18-blue.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)]()
[![Machine Learning](https://img.shields.io/badge/ML-Logistic%20Regression-orange.svg)]()
[![NLP](https://img.shields.io/badge/NLP-TF--IDF-green.svg)]()
[![AI](https://img.shields.io/badge/AI-Gemini-purple.svg)]()

---

## 📌 Overview

Spam and phishing emails are continuously evolving, making traditional rule-based filtering increasingly ineffective. Attackers frequently change wording, disguise malicious links, manipulate formatting, and use social-engineering techniques to deceive users.

This project develops an **intelligent Spam and Phishing Email Detection System** that combines Natural Language Processing, Machine Learning, mathematical optimization, metadata analysis, and Generative AI.

The system analyzes email content and metadata, extracts meaningful features, calculates a risk probability, and classifies emails into security categories.

### Core Pipeline

```text
Incoming Email
      ↓
NLP Preprocessing
      ↓
TF-IDF + Metadata Features
      ↓
Machine Learning Model
      ↓
Probability / Risk Score
      ↓
Spam / Phishing / Safe
      ↓
Gemini AI Explanation
```

---

# 🎯 Objectives

* Automatically detect spam and phishing emails.
* Process unstructured email text using NLP.
* Extract meaningful features using TF-IDF.
* Analyze suspicious email metadata.
* Apply machine-learning classification.
* Optimize model training using mathematical optimization.
* Reduce overfitting using regularization.
* Generate probability-based risk scores.
* Explain predictions using Generative AI.
* Provide an interactive email-security dashboard.
* Compare multiple machine-learning algorithms.

---

# 🚀 Key Features

* 📧 **Email Content Analysis**
* 🧹 **NLP Preprocessing**
* 📊 **TF-IDF Feature Extraction**
* 🔍 **Metadata & Heuristic Analysis**
* 🤖 **Logistic Regression Classification**
* 📈 **Probability-Based Risk Scoring**
* ⚙️ **Binary Cross-Entropy / Log-Loss Optimization**
* 📐 **L-BFGS / SGD Optimization**
* 🛡️ **L2 Regularization**
* 🧠 **Gemini AI Threat Explanation**
* 📉 **Model Performance Evaluation**
* 💻 **React + TypeScript Dashboard**

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │    Incoming Email   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  NLP Preprocessing  │
                    │                     │
                    │ • HTML Removal      │
                    │ • Regex Cleaning    │
                    │ • Tokenization      │
                    │ • Stopword Removal  │
                    │ • Stemming          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Feature Extraction  │
                    │                     │
                    │ • TF-IDF            │
                    │ • URL Features      │
                    │ • Metadata Signals  │
                    │ • Text Statistics   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Machine Learning    │
                    │                     │
                    │ Logistic Regression │
                    │ + Optimization      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Probability / Risk  │
                    │ Score               │
                    └──────────┬──────────┘
                               │
                      ┌────────┴────────┐
                      ▼                 ▼
                Classification     Gemini AI
                      │             Explanation
                      │                 │
                      └────────┬────────┘
                               ▼
                    ┌─────────────────────┐
                    │   Security          │
                    │   Dashboard         │
                    └─────────────────────┘
```

---

# 🔄 How the System Works

## 1. Email Input

The system receives email information including:

* Sender
* Subject
* Email body
* URLs
* HTML content
* Formatting information
* Available metadata

---

## 2. NLP Preprocessing

The raw email is cleaned before feature extraction.

### HTML Removal

Removes unnecessary HTML tags and formatting.

### Regex Cleaning

Removes unwanted characters and irrelevant patterns.

### Tokenization

Converts text into individual tokens.

Example:

```text
Verify your account immediately
```

becomes:

```text
["Verify", "your", "account", "immediately"]
```

### Stopword Removal

Common words such as:

```text
the
is
at
a
an
of
to
```

can be removed.

### Stemming

Related words are reduced toward common roots.

```text
bank
banks
banking
banker
```

---

# 📊 Feature Engineering

## TF-IDF

TF-IDF converts email text into numerical feature vectors.

```text
TF-IDF
   ↓
Text
   ↓
Numerical Feature Matrix
   ↓
Machine Learning Model
```

The model learns statistical relationships between textual features and email classes.

Potentially informative examples include:

```text
urgent
verify
account
password
login
security
locked
payment
transfer
click
```

---

# 🔍 Metadata Analysis

The system can analyze additional email-level indicators.

| Feature               | Purpose                           |
| --------------------- | --------------------------------- |
| URL Count             | Detect link-heavy messages        |
| Suspicious URL        | Identify potentially unsafe links |
| Uppercase Ratio       | Detect unusual formatting         |
| Punctuation Count     | Identify aggressive formatting    |
| Exclamation Count     | Detect urgency                    |
| Email Length          | Identify unusual structures       |
| Digit Count           | Detect numerical patterns         |
| Urgency Indicators    | Identify social engineering       |
| Verification Language | Detect account-related requests   |

---

# 🤖 Machine Learning

## Logistic Regression

Logistic Regression is the primary classification model.

It is suitable for this project because:

* It works efficiently with high-dimensional TF-IDF features.
* It is computationally efficient.
* It produces probability estimates.
* Its feature weights can be interpreted.
* It provides fast inference.

---

# 🧮 Mathematical Optimization

The classification model is trained by minimizing a loss function.

## Binary Cross-Entropy

For binary classification:

```text
L = -[y log(p) + (1-y) log(1-p)]
```

where:

* `y` = actual label
* `p` = predicted probability

The objective is to minimize the average loss over the training dataset.

---

# ⚙️ L2 Regularization

L2 regularization helps reduce overfitting.

Conceptually:

```text
Total Objective
=
Log-Loss
+
λ ||w||²
```

where:

* `λ` controls regularization strength.
* `w` represents model weights.

This discourages excessively large model weights.

---

# 📐 Optimization Methods

The project explores:

* Gradient Descent
* Stochastic Gradient Descent
* L-BFGS
* L2 Regularization

### Gradient Descent

Updates parameters iteratively in the direction that minimizes the loss.

### SGD

Uses individual or small batches of samples for iterative optimization.

### L-BFGS

Uses an approximation of second-order optimization information to efficiently converge toward a minimum.

---

# 🧪 Model Comparison

Multiple algorithms can be evaluated against the primary Logistic Regression model.

| Model                   |  Accuracy | Precision |    Recall |  F1-Score |
| ----------------------- | --------: | --------: | --------: | --------: |
| **Logistic Regression** | **98.4%** | **98.2%** | **98.5%** | **98.3%** |
| Naive Bayes             |     96.8% |     96.5% |     97.1% |     96.8% |
| Linear SVM              |     97.9% |     97.7% |     98.0% |     97.8% |
| Decision Tree           |     94.6% |     94.1% |     94.9% |     94.5% |

> ⚠️ **Important:** The values above are **illustrative placeholders**, not verified experimental results. Replace them with the actual metrics generated by your trained models before using the README for academic submission or professional claims.

---

# 📈 Model Evaluation

The system evaluates models using:

* Accuracy
* Precision
* Recall
* F1-Score
* Confusion Matrix
* ROC Curve
* ROC-AUC
* False Positive Rate
* False Negative Rate

### Accuracy

```text
Accuracy =
Correct Predictions / Total Predictions
```

### Precision

```text
Precision =
TP / (TP + FP)
```

### Recall

```text
Recall =
TP / (TP + FN)
```

### F1-Score

```text
F1 =
2 × Precision × Recall
----------------------
Precision + Recall
```

---

# 🎯 Risk Scoring

The classifier produces a probability that can be converted into a risk assessment.

Example:

```text
Classification : PHISHING
Risk Score      : 94%
```

The exact threshold and risk-score calculation should correspond to the implementation used by the project.

---

# 🧠 Gemini AI Explanation Layer

The project integrates Google Gemini as an explanation layer.

The ML model performs the actual classification, while Gemini converts the technical prediction and identified indicators into an understandable explanation.

```text
ML Prediction
      ↓
Risk Score
      ↓
Threat Indicators
      ↓
Gemini AI
      ↓
Plain-English Explanation
```

### Example

```text
Classification: PHISHING

Risk Score: 96%

Possible Reasons:

• The email uses urgent language.
• It asks the recipient to verify an account.
• It contains an external link.
• The message creates pressure for immediate action.
• The wording resembles common phishing patterns.
```

---

# 💻 Frontend Dashboard

The frontend is developed using:

* React 18
* TypeScript
* Tailwind CSS
* Lucide Icons

The dashboard is designed to display:

* Email input
* Classification
* Risk score
* Threat indicators
* Suspicious phrases
* AI-generated explanation
* Model metrics
* Evaluation results
* Audit information

---

# 🛠️ Technology Stack

## Machine Learning

* Python
* Scikit-learn
* Pandas
* NumPy

## NLP

* NLTK
* Regex
* Tokenization
* Stopword Removal
* Porter Stemmer
* TF-IDF

## Algorithms

* Logistic Regression
* Naive Bayes
* Linear SVM
* Decision Tree

## Optimization

* Binary Cross-Entropy
* Log-Loss
* Gradient Descent
* SGD
* L-BFGS
* L2 Regularization

## Frontend

* React 18
* TypeScript
* Tailwind CSS
* Lucide Icons

## Generative AI

* Google Gemini API

---

# 📚 Dataset

The project uses a labeled email dataset for supervised learning.

The final repository should document:

* Dataset name
* Dataset source
* Number of samples
* Class distribution
* Data cleaning
* Duplicate removal
* Train/test split
* Validation methodology

### Dataset Information

```text
Dataset Name : [ADD ACTUAL DATASET]
Source       : [ADD SOURCE]
Total Samples: [ADD NUMBER]
Ham          : [ADD NUMBER]
Spam         : [ADD NUMBER]
Phishing     : [ADD NUMBER IF APPLICABLE]
Train Split  : [ADD VALUE]
Test Split   : [ADD VALUE]
```

---

# 📁 Project Structure

```text
Spam-Phishing-Detection/
│
├── backend/
│   ├── data/
│   ├── preprocessing/
│   ├── features/
│   ├── models/
│   ├── training/
│   ├── evaluation/
│   └── app.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
│
├── notebooks/
│   ├── data_analysis.ipynb
│   ├── preprocessing.ipynb
│   ├── model_training.ipynb
│   └── model_evaluation.ipynb
│
├── tests/
├── requirements.txt
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

> Update this structure so that it exactly matches the actual repository.

---

# 🔐 Environment Variables

If Gemini API integration is enabled, configure the API key through an environment variable.

```env
GEMINI_API_KEY=your_api_key_here
```

Never commit API keys or other secrets to the repository.

Recommended `.gitignore` entries:

```text
.env
venv/
__pycache__/
*.pyc
node_modules/
```

---

# 🔒 Security & Privacy

Email content may contain sensitive information, so the system should follow secure data-handling practices.

Recommended practices include:

* Never expose API keys.
* Avoid unnecessary email storage.
* Sanitize HTML content.
* Validate URLs.
* Protect backend APIs.
* Use HTTPS in production.
* Avoid logging sensitive email content.
* Secure communication between frontend and backend.
* Apply authentication where necessary.

---

# ⚠️ Limitations

The system may have limitations including:

* Performance depends on the training dataset.
* New phishing techniques may not match learned patterns.
* False positives are possible.
* False negatives are possible.
* Traditional ML may have limited semantic understanding.
* External AI explanations may occasionally require verification.
* Real-world deployment requires extensive security testing.

---

# 🔮 Future Enhancements

### 📧 Real-Time Email Integration

Integration with Gmail, Outlook, and other email services.

### 🧠 Transformer-Based Models

Comparison with:

* BERT
* RoBERTa
* DistilBERT

### 🌍 Multilingual Detection

Support for phishing emails written in multiple languages.

### 📎 Attachment Analysis

Detection of potentially malicious:

* PDFs
* Documents
* Archives
* Executable files

### 🌐 URL Threat Intelligence

Integration with external URL reputation and threat-intelligence services.

### 👤 Sender Reputation

Analysis of:

* Sender domain
* Domain reputation
* Authentication signals
* Sender history

### 🔄 Continuous Learning

Retraining the model with newly detected spam and phishing examples.

### 🔍 Explainable AI

Visual explanations showing which features contributed most strongly to each prediction.

---

# 👥 Project Team

| Role               | Name              |
| ------------------ | ----------------- |
| **Team Lead (TL)** | **Chandan Reddy** |
| **Member 1 (M1)**  | **Chandan Reddy** |
| **Member 2 (M2)**  | **Sreesha**       |
| **Member 3 (M3)**  | **Jayanth**       |

---

# 👨‍💻 Team Contributions

## Chandan Reddy — Team Lead / M1

* Designed the overall system architecture.
* Planned the end-to-end NLP and ML pipeline.
* Developed the NLP preprocessing workflow.
* Implemented TF-IDF feature extraction.
* Worked on Logistic Regression.
* Worked on mathematical optimization.
* Applied regularization techniques.
* Contributed to model evaluation.
* Worked on frontend/backend integration.
* Integrated Gemini AI for threat explanations.
* Coordinated project development.

## Sreesha — M2

* Contributed to data preparation and experimentation.
* Assisted with model testing and evaluation.
* Contributed to system development.
* Assisted with documentation and validation.

## Jayanth — M3

* Contributed to system implementation.
* Assisted with testing and validation.
* Contributed to application integration.
* Assisted with documentation and project presentation.

---

# 🎓 Learning Outcomes

This project demonstrates practical knowledge of:

### NLP

* Text preprocessing
* Tokenization
* Stopword removal
* Stemming
* TF-IDF

### Machine Learning

* Supervised learning
* Classification
* Logistic Regression
* Naive Bayes
* SVM
* Decision Trees

### Mathematics

* Sigmoid function
* Probability
* Binary Cross-Entropy
* Log-Loss
* Gradient Descent
* L-BFGS
* Regularization

### Model Evaluation

* Accuracy
* Precision
* Recall
* F1-Score
* Confusion Matrix
* ROC-AUC

### Software Development

* Python
* React
* TypeScript
* API integration
* Environment configuration

### Generative AI

* Gemini API
* AI-assisted explanations
* Explainable threat analysis

---

# 🌟 Project Highlights

```text
✔ NLP-based email processing
✔ TF-IDF feature engineering
✔ Metadata-based risk indicators
✔ Logistic Regression classification
✔ Binary Cross-Entropy optimization
✔ L2 regularization
✔ L-BFGS / SGD optimization
✔ Comparative ML models
✔ Probability-based risk scoring
✔ Gemini AI explanations
✔ React + TypeScript dashboard
✔ Model evaluation
```

---

# 🏆 Project Impact

The project demonstrates how **Machine Learning and Generative AI can work together** to create a more explainable cybersecurity application.

Instead of simply showing:

```text
PHISHING
```

the system aims to provide:

```text
PHISHING
    ↓
Risk Score
    ↓
Threat Indicators
    ↓
AI Explanation
```

This helps users understand the reasoning behind a security warning rather than receiving only a classification label.

---

# 📄 License

This project is intended primarily for educational and research purposes.

An appropriate open-source license can be added to the repository if the project is distributed publicly.

---

# ⚠️ Disclaimer

This project is developed for **educational, academic, research, and demonstration purposes**.

The reported model performance should not be interpreted as guaranteed real-world phishing-detection performance.

A production-grade email-security solution would require:

* Large-scale evaluation
* Adversarial testing
* Threat-intelligence integration
* Continuous model monitoring
* Security audits
* Privacy controls
* Secure deployment
* Continuous retraining
* Real-world validation

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ **Star**.

---

## 🛡️ Spam & Phishing Email Detection System

**NLP + Machine Learning + Mathematical Optimization + Generative AI**

> Building smarter and more explainable email security through intelligent automation.
