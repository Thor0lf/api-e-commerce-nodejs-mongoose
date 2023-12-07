import { Router, Request, Response } from 'express';
import passport from 'passport';
import Product from '../models/product'; // 
import { handleCreateProductValidationErrors, validateCreateProductInput } from '../middlewares/validatorCreateProduct';
import { handleUpdateProductValidationErrors, validateUpdateProductInput } from '../middlewares/validatorUpdateProduct';

const product = Router();

product.get('/', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération des produits.' });
  }
});

product.get('/:productId', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findOne({ _id: productId });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération du produit.' });
  }
});

product.post('/create', passport.authenticate('jwt', { session: false }), validateCreateProductInput, handleCreateProductValidationErrors, async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: 'L\'utilisateur existe déjà.' });
    }

    const newProduct = new Product({ name, description, price });
    await newProduct.save();

    return res.status(201).json({ message: `Le produit ${newProduct.name} a été créé avec succès.` });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la création du produit.' });
  }
});

product.patch('/:productId', passport.authenticate('jwt', { session: false }), validateUpdateProductInput, handleUpdateProductValidationErrors, async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const { name, description, price } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé.' });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;

    await product.save();

    return res.status(200).json({ message: `Le produit a été mis à jour avec succès.` });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la mise à jour deu produit.' });
  }
});

product.delete('/:productId', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé.' });
    }
    await product.deleteOne();

    return res.status(200).json({ message: `Le produit ${product.name} a été supprimé avec succès.` });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la suppression du produit.' });
  }
});

export default product;