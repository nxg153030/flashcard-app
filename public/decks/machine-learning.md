---
title: Machine Learning 101 - Senior ML Engineer Edition
---

What are the key differences between supervised and unsupervised learning, and what are some popular algorithms in each category?

???

Supervised Learning:
- Learns from labeled data with input-output pairs
- Goal: Learn a mapping function from input to output
- Popular algorithms:
  * Classification: Random Forests, SVMs, XGBoost
  * Regression: Linear/Logistic Regression, Decision Trees
  * Deep Learning: CNNs, RNNs, Transformers

Unsupervised Learning:
- Learns patterns from unlabeled data
- Goal: Discover hidden structure in data
- Popular algorithms:
  * Clustering: K-means, DBSCAN, Hierarchical Clustering
  * Dimensionality Reduction: PCA, t-SNE, UMAP
  * Density Estimation: GMMs, KDE
  * Anomaly Detection: Isolation Forests, Autoencoders

---

Explain the mathematics behind gradient descent and its variants (SGD, Mini-batch). What are their respective trade-offs?

???

Gradient Descent Variants:

1. Batch Gradient Descent:
- Updates using entire dataset: $θ_{t+1} = θ_t - η∇J(θ_t)$
- Pros: Stable convergence, accurate gradient estimation
- Cons: Slow, memory intensive, can get stuck in local minima

2. Stochastic Gradient Descent (SGD):
- Updates using single sample: $θ_{t+1} = θ_t - η∇J(θ_t; x^{(i)}, y^{(i)})$
- Pros: Faster, can escape local minima, less memory
- Cons: High variance, noisy updates

3. Mini-batch Gradient Descent:
- Updates using batch of size m: $θ_{t+1} = θ_t - η\frac{1}{m}\sum_{i=1}^m∇J(θ_t; x^{(i)}, y^{(i)})$
- Pros: Balance between batch and SGD, vectorization benefits
- Cons: Requires batch size tuning

Key Considerations:
- Learning rate scheduling
- Momentum for faster convergence
- Batch size impact on generalization

---

Compare and contrast different optimization algorithms (Adam, RMSprop, AdaGrad). When would you choose one over the others?

???

1. Adam (Adaptive Moment Estimation):
- Combines momentum and adaptive learning rates
- Update rule:
  $m_t = β_1m_{t-1} + (1-β_1)g_t$
  $v_t = β_2v_{t-1} + (1-β_2)g_t^2$
  $\hat{m}_t = \frac{m_t}{1-β_1^t}$
  $\hat{v}_t = \frac{v_t}{1-β_2^t}$
  $θ_{t+1} = θ_t - \frac{η}{\sqrt{\hat{v}_t}+ε}\hat{m}_t$
- Best for: Most deep learning tasks, especially with sparse gradients
- Default choice for many applications

2. RMSprop:
- Adapts learning rates based on recent gradient history
- Update rule:
  $v_t = βv_{t-1} + (1-β)g_t^2$
  $θ_{t+1} = θ_t - \frac{η}{\sqrt{v_t+ε}}g_t$
- Good for: Non-stationary objectives, RNNs

3. AdaGrad:
- Adapts learning rates based on entire gradient history
- Update rule:
  $G_t = G_{t-1} + g_t^2$
  $θ_{t+1} = θ_t - \frac{η}{\sqrt{G_t+ε}}g_t$
- Good for: Sparse data, NLP tasks
- Issue: Learning rate can become very small

Choice Factors:
- Data sparsity
- Computational resources
- Problem non-stationarity
- Convergence requirements

---

Explain backpropagation in detail. How does it work mathematically, and what are its potential issues?

???

Backpropagation Algorithm:

1. Forward Pass:
- Compute activations layer by layer:
  $z^{[l]} = W^{[l]}a^{[l-1]} + b^{[l]}$
  $a^{[l]} = g^{[l]}(z^{[l]})$

2. Backward Pass:
- Output layer error:
  $δ^{[L]} = ∇_a J ⊙ g'^{[L]}(z^{[L]})$
- Hidden layer error:
  $δ^{[l]} = (W^{[l+1]T}δ^{[l+1]}) ⊙ g'^{[l]}(z^{[l]})$
- Gradients:
  $\frac{∂J}{∂W^{[l]}} = δ^{[l]}a^{[l-1]T}$
  $\frac{∂J}{∂b^{[l]}} = δ^{[l]}$

Issues:
1. Vanishing Gradients:
- Problem: Gradients become extremely small in early layers
- Solutions:
  * ReLU activation
  * Residual connections
  * Batch normalization

2. Exploding Gradients:
- Problem: Gradients become extremely large
- Solutions:
  * Gradient clipping
  * Layer normalization
  * Proper initialization

3. Memory Requirements:
- Need to store all intermediate activations
- Solutions:
  * Gradient checkpointing
  * Reversible architectures

---

Describe different regularization techniques and their effects on model training and performance.

???

1. L1 Regularization (Lasso):
- Adds $λ\sum|w_i|$ to loss
- Promotes sparsity
- Feature selection effect
- Mathematical impact: Pushes weights to exactly 0

2. L2 Regularization (Ridge):
- Adds $λ\sum w_i^2$ to loss
- Prevents large weights
- Smoother solutions
- Mathematical impact: Weight decay

3. Elastic Net:
- Combines L1 and L2: $λ_1\sum|w_i| + λ_2\sum w_i^2$
- Benefits of both approaches

4. Dropout:
- Randomly drops units during training
- Rate p: probability of keeping a unit
- Training: Scale outputs by 1/p
- Inference: No dropout, use full network
- Acts as model ensemble

5. Early Stopping:
- Monitor validation performance
- Stop when performance plateaus/degrades
- Implicit regularization
- Prevents overfitting

6. Data Augmentation:
- Creates synthetic training examples
- Domain-specific transformations
- Improves generalization
- Reduces overfitting

7. Batch Normalization:
- Normalizes layer inputs
- Reduces internal covariate shift
- Allows higher learning rates
- Acts as regularizer

---

Explain the architecture and key innovations of Transformers. How do they achieve their superior performance in NLP tasks?

???

Transformer Architecture:

1. Core Components:
- Multi-head Self-attention:
  * $Attention(Q,K,V) = softmax(\frac{QK^T}{\sqrt{d_k}})V$
  * Parallel attention heads
  * Captures different types of relationships

2. Key Innovations:
- Positional Encoding:
  * $PE_{(pos,2i)} = sin(pos/10000^{2i/d_{model}})$
  * $PE_{(pos,2i+1)} = cos(pos/10000^{2i/d_{model}})$
- Layer Normalization
- Residual Connections
- Feed-forward Networks

3. Architecture Details:
- Encoder:
  * Self-attention
  * Position-wise FFN
  * Add & Norm
- Decoder:
  * Masked self-attention
  * Encoder-decoder attention
  * Position-wise FFN

4. Advantages:
- Parallel processing
- Global context capture
- No recurrence needed
- Better gradient flow

5. Variants:
- BERT: Bidirectional encoder
- GPT: Decoder-only
- T5: Text-to-text framework

---

Describe the evolution and key components of modern CNN architectures (AlexNet to Vision Transformers).

???

Evolution of CNN Architectures:

1. AlexNet (2012):
- First major CNN success
- ReLU activation
- Local response normalization
- Overlapping pooling

2. VGG (2014):
- Simplified architecture
- 3x3 convolutions
- Deep but regular structure
- Heavy computation

3. ResNet (2015):
- Residual connections: $F(x) + x$
- Solved vanishing gradients
- Very deep networks possible
- Variants: ResNeXt, Wide ResNet

4. Inception/GoogLeNet:
- Parallel convolution paths
- Different receptive fields
- Efficient computation
- 1x1 convolutions for dimension reduction

5. DenseNet:
- Dense connections: $x_l = H_l([x_0, x_1, ..., x_{l-1}])$
- Feature reuse
- Reduced parameters
- Strong gradient flow

6. EfficientNet:
- Compound scaling
- Balanced depth/width/resolution
- State-of-the-art efficiency

7. Vision Transformer (ViT):
- Image patches as tokens
- Pure transformer architecture
- Position embeddings
- Strong performance at scale

8. Swin Transformer:
- Hierarchical feature maps
- Shifted windows
- Linear complexity
- CNN-like properties

---

What are the different types of attention mechanisms? How do they work and when should each be used?

???

Types of Attention Mechanisms:

1. Additive (Bahdanau) Attention:
- $score(s_t, h_i) = v^T tanh(W_1s_t + W_2h_i)$
- More powerful but computationally expensive
- Good for varying length inputs
- Used in neural machine translation

2. Multiplicative (Luong) Attention:
- $score(s_t, h_i) = s_t^T W h_i$
- Faster computation
- Scales better with dimension
- Popular in modern architectures

3. Scaled Dot-Product Attention:
- $Attention(Q,K,V) = softmax(\frac{QK^T}{\sqrt{d_k}})V$
- Used in Transformers
- Efficient matrix multiplication
- Scaling prevents softmax saturation

4. Multi-head Attention:
- Parallel attention heads
- Different representation subspaces
- Captures various relationships
- $MultiHead(Q,K,V) = Concat(head_1,...,head_h)W^O$

5. Self-attention:
- Attention within single sequence
- Q=K=V from same source
- Captures internal dependencies
- Global receptive field

6. Local Attention:
- Attends to local window
- Reduced computation
- Good for long sequences
- Used in efficient transformers

---

Explain different activation functions, their properties, and when to use each.

???

Activation Functions:

1. ReLU:
- $f(x) = max(0,x)$
- Pros:
  * No vanishing gradient for x > 0
  * Computationally efficient
  * Sparse activation
- Cons:
  * Dead neurons
  * Not zero-centered
- Use case: Default choice for hidden layers

2. Leaky ReLU:
- $f(x) = max(αx,x)$, typically α = 0.01
- Pros:
  * No dead neurons
  * All benefits of ReLU
- Cons:
  * Additional hyperparameter α
- Use case: When dead neurons are an issue

3. Sigmoid:
- $f(x) = \frac{1}{1+e^{-x}}$
- Pros:
  * Bounded output [0,1]
  * Clear probability interpretation
- Cons:
  * Vanishing gradient
  * Not zero-centered
- Use case: Binary classification output

4. Tanh:
- $f(x) = \frac{e^x-e^{-x}}{e^x+e^{-x}}$
- Pros:
  * Zero-centered
  * Bounded [-1,1]
- Cons:
  * Vanishing gradient
- Use case: Hidden layers in RNNs

5. GELU:
- $f(x) = x⋅Φ(x)$
- Pros:
  * Smooth
  * Non-monotonic
  * Better performance in transformers
- Use case: Modern transformer architectures

6. Swish:
- $f(x) = x⋅sigmoid(βx)$
- Pros:
  * Self-gated
  * Smooth
  * Non-monotonic
- Use case: Deep networks, especially mobile

---

Describe the U-Net architecture and its applications. What makes it particularly effective for image segmentation?

???

U-Net Architecture:

1. Structure:
- Contracting Path (Encoder):
  * Repeated (3x3 conv + ReLU + max pooling)
  * Doubles channels each step
  * Captures context

- Expanding Path (Decoder):
  * Upconvolution (2x2 up-conv)
  * Skip connections from encoder
  * Halves channels each step
  * Precise localization

2. Key Features:
- Skip Connections:
  * Preserve fine details
  * Combine low and high-level features
  * Helps gradient flow
  * Enables precise segmentation

3. Mathematical Operations:
- Downsampling:
  * Conv: $f_{out} = ReLU(W * f_{in} + b)$
  * MaxPool: $f_{out}(x,y) = max_{i,j∈N(x,y)} f_{in}(i,j)$

- Upsampling:
  * Deconv: $f_{out} = ReLU(W^T * f_{in} + b)$
  * Skip: $f_{out} = Concat(f_{skip}, f_{up})$

4. Applications:
- Medical Image Segmentation
- Satellite Image Analysis
- Instance Segmentation
- Cell Detection
- Document Analysis

5. Variants:
- 3D U-Net
- Attention U-Net
- Nested U-Net (UNet++)
- Dense U-Net

---

What are the key metrics and evaluation strategies for different types of machine learning problems?

???

Evaluation Metrics:

1. Classification:
- Accuracy: $\frac{TP+TN}{TP+TN+FP+FN}$
- Precision: $\frac{TP}{TP+FP}$
- Recall: $\frac{TP}{TP+FN}$
- F1-Score: $2⋅\frac{precision⋅recall}{precision+recall}$
- ROC-AUC, PR-AUC
- Cohen's Kappa

2. Regression:
- MSE: $\frac{1}{n}\sum(y_i-\hat{y}_i)^2$
- RMSE: $\sqrt{MSE}$
- MAE: $\frac{1}{n}\sum|y_i-\hat{y}_i|$
- R²: $1-\frac{\sum(y_i-\hat{y}_i)^2}{\sum(y_i-\bar{y})^2}$
- MAPE: $\frac{100}{n}\sum|\frac{y_i-\hat{y}_i}{y_i}|$

3. Clustering:
- Silhouette Score
- Davies-Bouldin Index
- Calinski-Harabasz Index
- Adjusted Rand Index
- V-measure

4. Ranking:
- NDCG
- MAP
- MRR
- Precision@k
- Recall@k

5. Cross-Validation Strategies:
- k-fold
- Stratified k-fold
- Leave-one-out
- Time series split
- Group k-fold

6. Statistical Tests:
- McNemar's test
- Wilcoxon signed-rank
- t-test
- ANOVA
- Cross-validated t-test 