import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface AmountPromptModalProps {
  visible: boolean;
  initialAmount?: string;
  loading?: boolean;
  min?: number;
  max?: number;
  title: string;
  description?: string;
  error?: string | null;
  onSubmit: (amount: number) => void;
  onClose: () => void;
}

const AmountPromptModal: React.FC<AmountPromptModalProps> = ({
  visible,
  initialAmount = '',
  loading = false,
  min,
  max,
  title,
  description,
  error,
  onSubmit,
  onClose,
}) => {
  const [value, setValue] = useState(initialAmount);

  useEffect(() => {
    setValue(initialAmount);
  }, [initialAmount, visible]);

  const parsed = Number(value.replace(',', '.'));
  const isValid = !Number.isNaN(parsed) && (!min || parsed >= min) && (!max || parsed <= max);

  const handleConfirm = () => {
    if (!isValid || loading) {
      return;
    }
    onSubmit(parsed);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}

          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="Введите сумму"
            keyboardType="decimal-pad"
            style={styles.input}
            editable={!loading}
          />

          {min || max ? (
            <Text style={styles.hint}>
              Допустимый диапазон: {min ?? 0} – {max ?? '∞'} ₽
            </Text>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, (!isValid || loading) && styles.buttonDisabled]}
            onPress={handleConfirm}
            disabled={!isValid || loading}
          >
            <Text style={styles.buttonText}>Подтвердить</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 8,
    marginBottom: 20,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  hint: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
  },
  error: {
    color: '#D32F2F',
    fontSize: 13,
    marginTop: 8,
  },
  button: {
    height: 48,
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  buttonDisabled: {
    backgroundColor: '#A7D0A8',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    alignSelf: 'center',
    marginTop: 12,
  },
  cancelText: {
    color: '#1F2937',
    fontSize: 14,
  },
});

export default AmountPromptModal;
