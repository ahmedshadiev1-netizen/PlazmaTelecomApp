import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface LoginModalProps {
  visible: boolean;
  loading?: boolean;
  error?: string | null;
  onSubmit: (username: string, password: string) => void;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  visible,
  loading = false,
  error,
  onSubmit,
  onClose,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!visible) {
      setUsername('');
      setPassword('');
    }
  }, [visible]);

  const disabled = loading || !username || !password;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Войти в систему</Text>
          <Text style={styles.subtitle}>
            Используйте логин и пароль из личного кабинета
          </Text>

          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Логин"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            style={styles.input}
            editable={!loading}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Пароль"
            secureTextEntry
            style={styles.input}
            editable={!loading}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, disabled && styles.buttonDisabled]}
            onPress={() => onSubmit(username, password)}
            disabled={disabled}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Войти</Text>
            )}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  button: {
    height: 48,
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
  error: {
    color: '#D32F2F',
    fontSize: 13,
    marginBottom: 4,
  },
});

export default LoginModal;
